<script>
  import Header from "./lib/Header.svelte";
  import Controls from "./lib/Controls.svelte";
  import Footer from "./lib/Footer.svelte";
  import Content from "./lib/Content.svelte";
  import { encodeString, decodeCharacter } from "./scripts/morse";
  import { addTimeouts, createPart } from "./scripts/audio";
  import * as Tone from "tone";

  let encodedText = "";
  let morseArray = [];
  let part;
  let cursor = -1;

  // text
  let text = "";
  let visibleText = "";
  let guessedCharacter = " ";

  // controls
  let playing = false;
  let finished = false;
  $: if (text || visibleText || guessedCharacter) {
    finished =
      text.trim().length === visibleText.trim().length + 1 &&
      text.slice(-1)[0] === guessedCharacter;
  }

  // load and set data
  const fetchHeadlines = async () => {
    const res = await fetch(import.meta.env.BASE_URL + "headlines.json");
    const json = await res.json();
    const headlines = json
      .slice(0, 5)
      .map((h) => h.title)
      .map((h) => h.replaceAll("»", "").replaceAll("«", ""));
    text = headlines.join(" +++ ");
    encodedText = encodeString(text);
    morseArray = addTimeouts([...encodedText]);
    part = createPart(morseArray, (c) => (cursor = c));
  };
  fetchHeadlines();

  // morsetokens
  $: currentWordMorseTokens = morseArray.length
    ? morseArray
        .slice(0, cursor + 1)
        .map((arr) => arr.character)
        .join("")
        .split(" / ")
        .filter((c) => c !== "/")
        .slice(-1)[0]
    : "";
  $: currentWordMorseTokensWithoutIncomplete = currentWordMorseTokens
    ?.split(" ")
    .slice(0, -1)
    .join(" ");
  $: currentCharacterMorseTokens =
    currentWordMorseTokens?.split(" ").slice(-1)[0] ?? "";

  // update visibleText/guessedCharacter if currentCharacterMorseTokens changes
  $: {
    if (currentCharacterMorseTokens) {
      const decoded = decodeCharacter(currentCharacterMorseTokens);
      if (decoded) {
        guessedCharacter = decoded;
      }
    } else {
      visibleText += guessedCharacter;
    }
  }

  // start/stop/restart button handlers
  const handleStartStopClick = () => {
    Tone.context.resume().then(() => {
      if (playing) {
        Tone.Transport.pause();
      } else {
        Tone.Transport.start();
      }
      playing = !playing;
    });
  };

  const handleRestart = () => {
    finished = false;
    visibleText = "";
    Tone.context.resume().then(() => {
      Tone.Transport.stop();
      part.stop();
      part.start(0);
      Tone.Transport.start();
    });
  };
</script>

<main>
  <Header />
  <Content
    {finished}
    {visibleText}
    {guessedCharacter}
    {text}
    {currentWordMorseTokensWithoutIncomplete}
    {currentCharacterMorseTokens}
    {morseArray}
  />
  <Controls {finished} {playing} {handleRestart} {handleStartStopClick} />
  <Footer />
</main>

<style>
  main {
    width: 100%;
    max-width: 550px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

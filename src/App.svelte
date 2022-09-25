<script>
  import { encodeString, decodeCharacter } from "./scripts/morse";
  import { addTimeouts, createPart } from "./scripts/audio";
  import * as Tone from "tone";

  let headlines = [];
  let encodedText = "";
  let morseArray = [];
  let part;
  let cursor = -1;

  // controls
  let playing = false;
  let finished = false;

  // current word
  let text = "";
  let word = "";
  let guessedCharacter = "";
  $: currentWordTokens = morseArray.length
    ? morseArray
        .slice(0, cursor + 1)
        .map((arr) => arr.character)
        .join("")
        .split(" / ")
        .filter((c) => c !== "/")
        .slice(-1)[0]
    : "";
  $: currentWordTokensWithoutIncomplete = currentWordTokens
    ?.split(" ")
    .slice(0, -1)
    .join(" ");
  $: currentCharacterTokens = currentWordTokens?.split(" ").slice(-1)[0] ?? "";
  $: console.log(currentCharacterTokens, currentWordTokens);
  $: {
    if (currentCharacterTokens) {
      const decoded = decodeCharacter(currentCharacterTokens);
      console.log(currentCharacterTokens);
      if (decoded) {
        guessedCharacter = decoded;
      }
    } else {
      word += guessedCharacter;
      // guessedCharacter = "";
    }
  }

  $: if (headlines.length) {
    text = headlines[0].title;
    encodedText = encodeString(headlines[0].title);
    morseArray = addTimeouts([...encodedText]);
    part = createPart(
      morseArray,
      (c) => (cursor = c),
      () => (finished = true)
    );
  }

  const fetchHeadlines = async () => {
    const res = await fetch(import.meta.env.BASE_URL + "headlines.json");
    const json = await res.json();
    headlines = json;
  };
  fetchHeadlines();

  const handleClick = () => {
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
    Tone.context.resume().then(() => {
      Tone.Transport.stop();
      part.stop();
      part.start(0);
      Tone.Transport.start();
    });
  };
</script>

<main>
  <p class="output">
    {word.toUpperCase()}<span style="color: red"
      >{guessedCharacter.toUpperCase()}</span
    >
  </p>

  <p class="morse">
    <span style="">
      {currentWordTokensWithoutIncomplete}<span style="color: red"
        >{currentCharacterTokens.replaceAll("/", "")}</span
      >
    </span>
  </p>

  <div class="controls">
    {#if finished}
      <button on:click={handleRestart}>{"Restart"}</button>
    {:else}
      <button on:click={handleClick}>{!playing ? "Start" : "Pause"}</button>
    {/if}
  </div>
</main>

<style>
  .output {
    font-family: "Courier";
  }
  .morse {
    font-size: 1.2rem;
    margin: 2rem 0 2.5rem 0;
  }
  .controls {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .controls:first-child {
    margin-right: 2rem;
  }
  p {
    height: 1.2rem;
    max-width: 600px;
  }
</style>

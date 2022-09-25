<script>
  import Phrase from "./lib/Morse/Phrase.svelte";
  import Info from "./assets/icons/Info.svelte";
  import { encodeString, decodeCharacter } from "./scripts/morse";
  import { addTimeouts, createPart } from "./scripts/audio";
  import { tippy } from "svelte-tippy";
  import * as Tone from "tone";

  let headlines = [];
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
  let finished =
    text.length === visibleText.length + 1 &&
    text.slice(-1)[0] === guessedCharacter;

  // tokens
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

  // update visibleText/guessedCharacter if currentCharacterTokens changes
  $: {
    if (currentCharacterTokens) {
      const decoded = decodeCharacter(currentCharacterTokens);
      if (decoded) {
        guessedCharacter = decoded;
      }
    } else {
      visibleText += guessedCharacter;
    }
  }

  $: if (headlines.length) {
    text = headlines.map((h) => h.title).join(" +++ ");
    encodedText = encodeString(text);
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
    headlines = json.slice(0, 5);
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
    visibleText = "";
    Tone.context.resume().then(() => {
      Tone.Transport.stop();
      part.stop();
      part.start(0);
      Tone.Transport.start();
    });
  };
  $: console.log(currentCharacterTokens);
</script>

<main>
  <a href="https://www.spiegel.de" style="height:2px">
    <div class="header">
      <h1 class="title sans">DER</h1>
      <Phrase phrase="SPIEGEL" encode={true} style="padding: 0 1rem;" />
      <h1 class="title sans">GEMORST</h1>
    </div>
  </a>

  <div class="content">
    <p class="output">
      {#if !finished}
        <span>
          <span>{visibleText.toUpperCase()}</span><span
            style="color: red;margin-left: 0.05rem"
          >
            {guessedCharacter.toUpperCase()}
          </span>
        </span>
      {:else}
        {text.toUpperCase()}
      {/if}
    </p>

    <div class="morse">
      {#if !finished}
        <span>
          <Phrase phrase={currentWordTokensWithoutIncomplete} />
          <span>
            <Phrase
              phrase={currentCharacterTokens.replaceAll("/", "")}
              highlighted={true}
            />
          </span>
        </span>
      {:else}
        <span>
          <Phrase phrase={morseArray.map((m) => m.character).join("")} />
        </span>
      {/if}
    </div>
  </div>

  <div class="controls">
    {#if finished}
      <button on:click={handleRestart} class="sans">{"Restart"}</button>
    {:else}
      <button on:click={handleClick} class="sans"
        >{!playing ? "Start" : "Pause"}</button
      >
    {/if}
  </div>
</main>

<style>
  main {
    max-width: 100%;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  .title {
    font-size: 1.6rem;
    line-height: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0.75rem 0;
  }
  @media (max-width: 450px) {
    .title {
      font-size: 1.4rem;
    }
  }
  .content {
    margin: 3rem 0;
  }
  .output {
    font-family: "Special Elite", "Cutive Mono", Courier;
    margin-bottom: 1.5rem;
  }
  .morse {
    min-height: 1.5rem;
  }
  p {
    /* min-height: 1.2rem; */
    max-width: 550px;
    margin: 1rem 0;
  }
  .controls {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .controls:first-child {
    margin-right: 2rem;
  }
</style>

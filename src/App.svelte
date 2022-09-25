<script>
  import { encodeString, decodeCharacter } from "./scripts/morse";
  import { addTimeouts, createPart } from "./scripts/audio";
  import * as Tone from "tone";

  let headlines = [];
  let encodedText = "";
  let morseArray = [];
  let part;
  let cursor = -1;

  // text
  let text = "";
  let visibleText = "";
  let guessedCharacter = "";

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
    text = headlines[0].title;
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
  <p class="output">
    {#if !finished}
      {visibleText.toUpperCase()}<span style="color: red"
        >{guessedCharacter.toUpperCase()}</span
      >
    {:else}
      {text}
    {/if}
  </p>

  <p class="morse">
    {#if !finished}
      <span>
        {currentWordTokensWithoutIncomplete}<span style="color: red"
          >{currentCharacterTokens.replaceAll("/", "")}</span
        >
      </span>
    {:else}
      <span>
        {morseArray.map((m) => m.character).join("")}
      </span>
    {/if}
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
  /* cutive-mono-regular - latin */
  @font-face {
    font-family: "Cutive Mono";
    font-style: normal;
    font-weight: 600;
    src: url("/fonts/cutive/cutive-mono-v14-latin-regular.eot"); /* IE9 Compat Modes */
    src: local(""),
      url("/fonts/cutive/cutive-mono-v14-latin-regular.eot?#iefix")
        format("embedded-opentype"),
      /* IE6-IE8 */ url("/fonts/cutive/cutive-mono-v14-latin-regular.woff2")
        format("woff2"),
      /* Super Modern Browsers */
        url("/fonts/cutive/cutive-mono-v14-latin-regular.woff") format("woff"),
      /* Modern Browsers */
        url("/fonts/cutive/cutive-mono-v14-latin-regular.ttf")
        format("truetype"),
      /* Safari, Android, iOS */
        url("/fonts/cutive/cutive-mono-v14-latin-regular.svg#CutiveMono")
        format("svg"); /* Legacy iOS */
  }
  @font-face {
    font-family: "Cutive Mono";
    font-style: normal;
    font-weight: 600;
    src: url("/spiegel-morse/fonts/cutive/cutive-mono-v14-latin-regular.eot"); /* IE9 Compat Modes */
    src: local(""),
      url("/spiegel-morse/fonts/cutive/cutive-mono-v14-latin-regular.eot?#iefix")
        format("embedded-opentype"),
      /* IE6-IE8 */
        url("/spiegel-morse/fonts/cutive/cutive-mono-v14-latin-regular.woff2")
        format("woff2"),
      /* Super Modern Browsers */
        url("/spiegel-morse/fonts/cutive/cutive-mono-v14-latin-regular.woff")
        format("woff"),
      /* Modern Browsers */
        url("/spiegel-morse/fonts/cutive/cutive-mono-v14-latin-regular.ttf")
        format("truetype"),
      /* Safari, Android, iOS */
        url("/spiegel-morse/fonts/cutive/cutive-mono-v14-latin-regular.svg#CutiveMono")
        format("svg"); /* Legacy iOS */
  }

  .output {
    font-family: "Cutive Mono";
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
    min-height: 1.2rem;
    max-width: 600px;
  }
</style>

<script>
  import { encodeString } from "./scripts/morse";
  import { addTimeouts, createPart } from "./scripts/audio";
  import * as Tone from "tone";

  let headlines = [];
  let text = "";
  let encodedText = "";
  let part;
  let cursor = -1;
  let playing = false;
  let finished = false;

  $: if (headlines.length) {
    text = headlines[0].title;
    encodedText = encodeString(text);
    const morseArray = addTimeouts([...encodedText]);
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
  <p>{text}</p>

  <p class="morse">
    <span style="color: red">
      {encodedText.slice(0, cursor + 1)}
    </span><span style="color: green">
      {encodedText.slice(cursor + 1, encodedText.length + 1)}
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
  .morse {
    font-size: 1.2rem;
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
    max-width: 600px;
  }
</style>

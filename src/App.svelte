<script>
  import { encodeString } from "./scripts/morse";
  import { sonify, addTimeouts, DOT } from "./scripts/audio";

  const text = "Das ist ein Testsatz. Bitte testen.";
  const encodedText = encodeString(text);
  const morseCharacters = [...encodedText];

  let cursor = -1;

  const handleClick = () => {
    cursor = -1;
    const morseArray = addTimeouts(morseCharacters);
    morseArray.forEach(([c, timeout], i) => {
      sonify(c, timeout);
      setTimeout(() => {
        cursor = i;
      }, timeout * 1000);
    });
  };
  console.log(encodedText);
</script>

<main>
  <p>{text}</p>

  <p class="morse">
    <span style="color: red">
      {encodedText.slice(0, cursor + 1)}
    </span>

    <span style="color: green">
      {encodedText.slice(cursor + 1, encodedText.length + 1)}
    </span>
  </p>

  <button on:click={handleClick}>Ton</button>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }

  .morse {
    font-size: 1.2rem;
  }
</style>

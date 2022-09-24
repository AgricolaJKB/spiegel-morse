<script>
  import { encodeString } from "./scripts/morse";
  import { sonify } from "./scripts/audio";

  const text = "Tes";
  const encodedText = encodeString("Testtest");

  const handleClick = () => {
    const morseCharacters = [...encodedText];
    console.log(morseCharacters);
    morseCharacters.forEach((c, i) => {
      setTimeout(() => {
        sonify(c);
      }, i * 200);
    });
  };
</script>

<main>
  <p>{text}</p>

  <p>
    {encodedText}
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
</style>

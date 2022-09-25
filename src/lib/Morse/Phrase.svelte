<script>
  import Character from "./Character.svelte";
  import { encodeString } from "../../scripts/morse";

  export let style = "";
  export let highlighted = false;
  export let phrase = "";
  export let encode = false;
  $: cleanedPhrase = phrase.replaceAll("/", "");
  $: encodedPhrase = encodeString(cleanedPhrase);
  $: output = encode ? encodedPhrase : cleanedPhrase;
</script>

<span class="container" {style}>
  {#each output as m, i (i)}
    <Character character={m} {highlighted} />
  {/each}
</span>

<style>
  .container {
    width: max-content;
    height: 2px;
    line-height: 2px;
    font-size: 2px;
  }
</style>

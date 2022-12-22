<script>
  import Phrase from "./Phrase.svelte";

  export let finished;

  export let visibleText;
  export let guessedCharacter;
  export let text;

  export let currentWordMorseTokensWithoutIncomplete;
  export let currentCharacterMorseTokens;
  export let morseArray;
</script>

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
        <Phrase phrase={currentWordMorseTokensWithoutIncomplete} />
        <span>
          <Phrase
            phrase={currentCharacterMorseTokens.replaceAll("/", "")}
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

<style>
  .content {
    margin: 3rem 0;
    min-height: calc(100vh - 30rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .output {
    font-family: "Special Elite", "Cutive Mono", Courier;
    margin: 0 auto;
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
</style>

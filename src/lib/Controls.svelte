<script>
  export let finished;
  export let playing;
  export let handleRestart;
  export let handleStartStopClick;
</script>

<div class="controls">
  {#if finished}
    <button on:click={handleRestart} class="sans">{"Restart"}</button>
  {:else}
    <button on:click={handleStartStopClick} class="sans"
      >{!playing ? "Start" : "Pause"}</button
    >
  {/if}
  <!-- TODO speed slider not working atm -->
  <!-- <div id="slider">
    <span class="sans">fast</span>
    <input
      type="range"
      min="0.01"
      max="0.07"
      step="0.03"
      bind:value={speed}
      style="width:80px;margin-left:1rem;margin-right:1rem;"
    />
    <span class="sans">slow</span>
  </div> -->
</div>

<style>
  .controls {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  .controls:first-child {
    margin-right: 2rem;
  }
  #slider {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 2rem;
  }
</style>

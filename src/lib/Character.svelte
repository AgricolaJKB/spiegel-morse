<script>
  export let character;
  export let highlighted = false;
</script>

{#if character === "-"}
  <span class="dash" style={highlighted ? "background-color:red" : ""} />
{:else if character === "."}
  <span class="point" style={highlighted ? "background-color:red" : ""} />
{:else if character === " "}
  <span class="space" style={highlighted ? "background-color:red" : ""} />
{:else}
  {character}
{/if}

<style>
  .point {
    display: inline-block;
    height: 2px;
    width: 2px;
    background-color: white;
  }
  .dash {
    display: inline-block;
    height: 2px;
    width: 8px;
    background-color: white;
  }
  .point,
  .dash {
    margin-right: 3px;
  }
  .space {
    display: inline-block;
    height: 2px;
    width: 6px;
  }
</style>

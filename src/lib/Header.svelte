<script>
  import Phrase from "./Phrase.svelte";

  let headerHovered = false;
  const handleHeaderHovered = () => (headerHovered = !headerHovered);
</script>

<a href="https://www.spiegel.de" style="height:2px;">
  <div
    class="header"
    on:mouseenter={handleHeaderHovered}
    on:mouseleave={handleHeaderHovered}
  >
    <h1 class="title sans">DER</h1>
    {#if !headerHovered}
      <Phrase phrase="SPIEGEL" encode={true} style="padding: 0 1rem;" />
    {:else}
      <h1 class="title sans" style="color:red">&nbsp;SPIEGEL&nbsp;</h1>
    {/if}
    <h1 class="title sans">GEMORST</h1>
  </div>
</a>

<style>
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
</style>

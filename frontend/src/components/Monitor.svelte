<script lang="ts">
  import { onMount } from 'svelte'

  import { appCtx, AppSize } from '../core/context'

  onMount(() => {
    const appContainer = document.getElementById('app')
    appContainer.prepend($appCtx.view)
  })
</script>

<div
  class="monitor"
  style="width: {AppSize.WIDTH}px; height: {AppSize.HEIGHT}px;"
/>

<style>
  .monitor {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;

    background: var(--dark500);
    outline: 16px solid var(--blue600);
  }
</style>

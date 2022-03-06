<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appContext, AppSize } from '../core/context'

  onMount(() => {
    const appContainer = document.getElementById('app')
    appContainer.prepend($appContext.view)
  })
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appContext } from '../core/context'

  onMount(() => {
    const appContainer = document.getElementById('app')
    const app = new PIXI.Application({
      width: 800,
      height: 600,
    })

    appContainer.appendChild(app.view)
    appContext.set(app)

    app.stage.interactive = true
  })
</script>

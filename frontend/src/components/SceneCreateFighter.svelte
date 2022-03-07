<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { AppLayer, AppSize } from 'core/constant'
  import { appCtx } from 'core/app'

  onMount(() => {
    const bg = new PIXI.Graphics()
    bg.zIndex = AppLayer.BACKGROUND
    bg.beginFill(0xffffff)
      .drawRect(0, 0, AppSize.WIDTH, AppSize.HEIGHT)
      .endFill()
    $appCtx.stage.addChild(bg)
  })
</script>

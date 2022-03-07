<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx } from 'core/context'
  import type { ButtonCode } from 'core/buttonCode'

  export let code: ButtonCode
  export let sprite: string
  export let position: number[]

  let isClicked = false

  onMount(() => {
    const btn = PIXI.Sprite.from(sprite)
    btn.zIndex = 2
    btn.position.set(position[0], position[1])
    btn.anchor.set(0.5)
    btn.scale.set(0.5)
    btn.interactive = true
    btn.buttonMode = true

    btn
      .on('mousedown', () => {
        console.log('click', code)
        btn.scale.set(0.45)
        isClicked = true
      })
      .on('mouseup', () => {
        btn.scale.set(0.5)
        isClicked = false
      })
      .on('mouseupoutside', () => {
        btn.scale.set(0.5)
        isClicked = false
      })

    $appCtx.stage.addChild(btn)
  })
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx } from 'core/context'
  import type { ButtonCode } from 'core/buttonCode'

  export let code: ButtonCode
  export let sprite: string
  export let position: number[]

  let isClicked = false
  let self: PIXI.Sprite

  onMount(() => {
    self = PIXI.Sprite.from(sprite)
    self.zIndex = 2
    self.position.set(position[0], position[1])
    self.anchor.set(0.5)
    self.scale.set(0.5)
    self.interactive = true
    self.buttonMode = true

    self
      .on('mousedown', handleMouseDown)
      .on('mouseup', handleMouseUp)
      .on('mouseupoutside', handleMouseUp)

    $appCtx.stage.addChild(self)
  })

  function handleMouseDown() {
    isClicked = true
    console.log('click', code)
    self.scale.set(0.45)
  }

  function handleMouseUp() {
    isClicked = false
    self.scale.set(0.5)
  }
</script>

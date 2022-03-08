<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx } from 'core/app'
  import { AppLayer } from 'core/constant'

  export let sprite: string
  export let position: number[]
  export let rotation = 0
  export let layer = AppLayer.CONTROLLER
  export let onClick = () => {}

  let self: PIXI.Sprite

  onMount(() => {
    self = PIXI.Sprite.from($appCtx.loader.resources[sprite].texture)
    self.zIndex = layer
    self.position.set(position[0], position[1])
    self.anchor.set(0.5)
    self.scale.set(0.5)
    self.rotation = rotation
    self.interactive = true
    self.buttonMode = true

    self
      .on('mousedown', handleMouseDown)
      .on('mouseup', handleMouseUp)
      .on('mouseupoutside', handleMouseUp)

    $appCtx.stage.addChild(self)
  })

  function handleMouseDown() {
    self.scale.set(0.45)
    onClick()
  }

  function handleMouseUp() {
    self.scale.set(0.5)
  }
</script>

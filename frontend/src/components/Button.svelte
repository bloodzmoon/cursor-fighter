<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameIMG, GameLayer } from 'core/constant'

  export let sprite: GameIMG
  export let position: number[]
  export let container = $gameCtx.app.stage
  export let angle = 0
  export let layer = GameLayer.CONTROLLER
  export let onClick = () => {}

  let self: PIXI.Sprite

  onMount(() => {
    self = PIXI.Sprite.from($gameCtx.app.loader.resources[sprite].texture)
    self.zIndex = layer
    self.position.set(position[0], position[1])
    self.anchor.set(0.5)
    self.scale.set(0.5)
    self.angle = angle
    self.interactive = true
    self.buttonMode = true

    self
      .on('mousedown', handleMouseDown)
      .on('mouseup', handleMouseUp)
      .on('mouseupoutside', handleMouseUp)

    container.addChild(self)
  })

  function handleMouseDown() {
    self.scale.set(0.45)
    onClick()
  }

  function handleMouseUp() {
    self.scale.set(0.5)
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { sound } from '@pixi/sound'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx } from 'core/app'
  import { AppLayer, ButtonCode } from 'core/constant'
  import { controllerCtx } from 'core/controller'

  export let code: ButtonCode
  export let sprite: string
  export let position: number[]
  export let layer = AppLayer.CONTROLLER

  const DRAG_RADIUS = 23

  let isDragging = false
  let self: PIXI.Sprite
  let mousePos: PIXI.Point

  onMount(() => {
    self = PIXI.Sprite.from($appCtx.loader.resources[sprite].texture)
    self.zIndex = layer
    self.position.set(position[0], position[1])
    self.anchor.set(0.5)
    self.scale.set(0.5)
    self.interactive = true
    self.buttonMode = true

    self
      .on('mousedown', handleDragStart)
      .on('mouseup', handleDragEnd)
      .on('mouseupoutside', handleDragEnd)
      .on('mousemove', handleDragMove)

    $appCtx.stage.addChild(self)
  })

  function handleDragStart(e: PIXI.InteractionEvent) {
    isDragging = true
    mousePos = e.data.global
    sound.play('controllerTapFX', { volume: 0.3 })
  }

  function handleDragEnd() {
    isDragging = false
    self.position.set(position[0], position[1])
    sound.play('controllerTapFX', { volume: 0.3 })

    // Update controller context
    if (code === ButtonCode.ANALOG_LEFT) {
      $controllerCtx[code] = [0, 0]
    }
  }

  function handleDragMove() {
    if (!isDragging) return

    const diff = vec2.sub([], [mousePos.x, mousePos.y], position)
    const diffLength = vec2.len(diff)
    $controllerCtx[code] = diff

    if (diffLength > DRAG_RADIUS) {
      const radians = Math.atan2(
        mousePos.y - position[1],
        mousePos.x - position[0]
      )
      const borderedX = Math.cos(radians) * DRAG_RADIUS + position[0]
      const borderedY = Math.sin(radians) * DRAG_RADIUS + position[1]
      self.position.set(borderedX, borderedY)
    } else {
      self.position.set(mousePos.x, mousePos.y)
    }

    // Update controller context
    if (code === ButtonCode.ANALOG_LEFT) {
      $controllerCtx[code] = diff
    } else if (code === ButtonCode.ANALOG_RIGHT) {
      $controllerCtx[code] = Math.atan2(diff[1], diff[0])
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { sound } from '@pixi/sound'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { gameCtx } from 'core/game'
  import { GameLayer, ButtonCode, GameIMG, GameFX } from 'core/constant'
  import { controllerCtx } from 'core/controller'

  export let code: ButtonCode
  export let position: number[]

  const DRAG_RADIUS = 23

  let isDragging = false
  let self: PIXI.Sprite
  let mousePos: PIXI.Point

  onMount(() => {
    self = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.BTN_STICK].texture
    )
    self.zIndex = GameLayer.CONTROLLER + 1
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

    $gameCtx.controller.addChild(self)
  })

  function handleDragStart(e: PIXI.InteractionEvent) {
    isDragging = true
  }

  function handleDragEnd() {
    isDragging = false
    self.position.set(position[0], position[1])
    sound.play(GameFX.CONTROLLER_TAP)

    // Update controller context
    if ($gameCtx.me.isDead) return
    if (code === ButtonCode.ANALOG_LEFT) {
      $controllerCtx[code] = [0, 0]
    }
  }

  function handleDragMove(e: PIXI.InteractionEvent) {
    if (!isDragging) return
    mousePos = e.data.getLocalPosition($gameCtx.controller)

    const diff = vec2.sub([], [mousePos.x, mousePos.y], position)
    const diffLength = vec2.len(diff)

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
    if ($gameCtx.me.isDead) return
    if (code === ButtonCode.ANALOG_LEFT) {
      $controllerCtx[code] = diff
    } else if (code === ButtonCode.ANALOG_RIGHT) {
      $controllerCtx[code] = Math.atan2(diff[1], diff[0])
    }
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx } from 'core/app'
  import { AppLayer } from 'core/constant'

  export let sprite: string
  export let position: number[]
  export let layer = AppLayer.CONTROLLER

  const DRAG_RADIUS = 23

  let isDragging = false
  let self: PIXI.Sprite
  let data: PIXI.InteractionData

  onMount(() => {
    self = PIXI.Sprite.from(sprite)
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
    data = e.data
  }

  function handleDragEnd() {
    isDragging = false
    self.position.set(position[0], position[1])
  }

  function handleDragMove() {
    if (!isDragging) return

    const mousePos = data.global
    const diff = vec2.sub([], [mousePos.x, mousePos.y], position)
    const diffLength = vec2.len(diff)

    if (diffLength > DRAG_RADIUS) {
      const radians = Math.atan2(
        mousePos.y - position[1],
        mousePos.x - position[0]
      )
      const limitedX = Math.cos(radians) * DRAG_RADIUS + position[0]
      const limitedY = Math.sin(radians) * DRAG_RADIUS + position[1]
      self.position.set(limitedX, limitedY)
    } else {
      self.position.set(mousePos.x, mousePos.y)
    }
  }
</script>

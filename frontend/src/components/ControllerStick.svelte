<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx } from 'core/context'

  export let sprite: string
  export let position: number[]

  const DRAG_LIMIT = 23

  let isDragging = false
  let self: PIXI.Sprite
  let data: PIXI.InteractionData

  onMount(() => {
    self = PIXI.Sprite.from(sprite)
    self.zIndex = 2
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

    const newPos = data.getLocalPosition($appCtx.stage)
    const diff = vec2.sub([], [newPos.x, newPos.y], [position[0], position[1]])
    const diffLength = vec2.len(diff)
    if (diffLength > DRAG_LIMIT) {
      console.log('eiei')
    }
    self.position.set(newPos.x, newPos.y)
  }
</script>

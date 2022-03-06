<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appContext } from '../core/context'
  import cursor01 from '../assets/cursor01.png'

  let isClicked = false
  let mX = 0,
    mY = 0

  onMount(() => {
    const cursor = PIXI.Sprite.from(cursor01)
    $appContext.stage.addChild(cursor)

    $appContext.stage.on('mousedown', (e) => {
      isClicked = true

      let pos = e.data.global
      cursor.x = pos.x
      cursor.y = pos.y
    })
    $appContext.stage.on('mouseup', (e) => {
      isClicked = false
    })
    $appContext.stage.on('mousemove', (e: PIXI.InteractionEvent) => {
      let pos = e.data.global
      mX = pos.x
      mY = pos.y

      if (isClicked) {
        cursor.x = pos.x
        cursor.y = pos.y
      }
    })
  })
</script>

<p style="color: white;">isClick: {isClicked} / X: {mX} / Y: {mY}</p>

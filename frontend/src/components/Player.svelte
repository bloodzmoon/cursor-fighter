<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appContext } from '../core/context'
  import cursor01 from '../assets/cursor01.png'

  let isClicked = false
  let isInScreen = false
  let mX = 0
  let mY = 0

  onMount(() => {
    const cursor = PIXI.Sprite.from(cursor01)
    $appContext.stage.addChild(cursor)

    $appContext.stage.on('mousedown', (e: PIXI.InteractionEvent) => {
      isClicked = true

      let pos = e.data.global
      cursor.x = pos.x
      cursor.y = pos.y
    })
    $appContext.stage.on('mouseup', () => {
      isClicked = false
    })
    $appContext.stage.on('mouseover', () => {
      isInScreen = true
    })
    $appContext.stage.on('mouseout', () => {
      isInScreen = false
    })
    $appContext.stage.on('pointermove', (e: PIXI.InteractionEvent) => {
      if (!isInScreen) return

      let pos = e.data.global
      mX = pos.x
      mY = pos.y

      if (!isClicked) return
      cursor.x = pos.x
      cursor.y = pos.y
    })
  })
</script>

<p>isInScreen: {isInScreen} / isClick: {isClicked} / X: {mX} / Y: {mY}</p>

<style>
  p {
    color: white;
    position: absolute;
    top: 20px;
    left: 20px;
  }
</style>

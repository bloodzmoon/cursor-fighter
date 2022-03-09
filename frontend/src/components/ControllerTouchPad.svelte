<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameLayer } from 'core/constant'

  export let position: number[]

  enum TouchPadSize {
    WIDTH = 164,
    HEIGHT = 88,
  }

  const LAYER = GameLayer.CONTROLLER + 1

  let touchPad: PIXI.Container
  let loadingIcon: PIXI.Text
  let loadingText: PIXI.Text

  onMount(() => {
    touchPad = new PIXI.Container()
    touchPad.zIndex = LAYER
    touchPad.position.set(position[0], position[1])
    $gameCtx.controller.addChild(touchPad)

    loadingIcon = new PIXI.Text('{}', {
      fontFamily: 'Pokemon',
      fontSize: 28,
      fill: 0xffffff,
    })
    loadingIcon.zIndex = LAYER
    loadingIcon.anchor.set(0.5)
    loadingIcon.position.set(
      TouchPadSize.WIDTH / 2,
      TouchPadSize.HEIGHT / 2 - 15
    )
    touchPad.addChild(loadingIcon)

    loadingText = new PIXI.Text('Loading', {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xffffff,
    })
    loadingText.zIndex = LAYER
    loadingText.anchor.set(0.5)
    loadingText.position.set(
      TouchPadSize.WIDTH / 2,
      TouchPadSize.HEIGHT / 2 + 15
    )
    touchPad.addChild(loadingText)

    $gameCtx.app.ticker.add(handleLoadingIcon)
  })

  function handleLoadingIcon(dt: number) {
    if ($gameCtx.isControllerLoading) {
      loadingIcon.rotation += 0.1 * dt
      loadingIcon.visible = true
      loadingText.visible = true
    } else {
      loadingIcon.visible = false
      loadingText.visible = false
    }
  }
</script>

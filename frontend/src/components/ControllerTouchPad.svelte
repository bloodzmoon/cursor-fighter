<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameLayer, GameScene } from 'core/constant'

  export let position: number[]

  enum TouchPadSize {
    WIDTH = 164,
    HEIGHT = 88,
  }
  enum HealthBar {
    WIDTH = TouchPadSize.WIDTH - 58,
    HEIGHT = 14,
  }

  const LAYER = GameLayer.CONTROLLER + 1

  let touchPad: PIXI.Container

  let loadingUI: PIXI.Container
  let loadingIcon: PIXI.Text
  let loadingText: PIXI.Text

  let fightUI: PIXI.Container
  let healthBar: PIXI.Graphics

  onMount(() => {
    touchPad = new PIXI.Container()
    touchPad.zIndex = LAYER
    touchPad.position.set(position[0], position[1])
    $gameCtx.controller.addChild(touchPad)

    loadingUI = new PIXI.Container()
    fightUI = new PIXI.Container()
    touchPad.addChild(loadingUI)
    touchPad.addChild(fightUI)

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
    loadingUI.addChild(loadingIcon)

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
    loadingUI.addChild(loadingText)

    let hpText = new PIXI.Text('HP', {
      fontFamily: 'Pokemon',
      fill: 0xc4c4c4,
    })
    hpText.x = 14
    hpText.y = TouchPadSize.HEIGHT - 28
    fightUI.addChild(hpText)

    healthBar = new PIXI.Graphics()
    healthBar.zIndex = LAYER
    healthBar
      .beginFill(0xc4c4c4)
      .drawRect(40, TouchPadSize.HEIGHT - 28, HealthBar.WIDTH, HealthBar.HEIGHT)
      .endFill()
    fightUI.addChild(healthBar)

    $gameCtx.app.ticker.add(handleUI)
    $gameCtx.app.ticker.add(handleFighterUI)
  })

  function handleUI(dt: number) {
    if ($gameCtx.isControllerLoading) {
      loadingIcon.rotation += 0.1 * dt
      loadingUI.visible = true
      fightUI.visible = false
    } else if ($gameCtx.scene === GameScene.PLAY_DEATH_MATCH) {
      loadingUI.visible = false
      fightUI.visible = true
    } else {
      loadingUI.visible = false
      fightUI.visible = false
    }
  }

  function handleFighterUI() {
    healthBar.clear()
    healthBar
      .beginFill(0xc4c4c4)
      .drawRect(
        40,
        TouchPadSize.HEIGHT - 28,
        (HealthBar.WIDTH * $gameCtx.me.health) / $gameCtx.me.maxHealth,
        HealthBar.HEIGHT
      )
      .endFill()
  }
</script>

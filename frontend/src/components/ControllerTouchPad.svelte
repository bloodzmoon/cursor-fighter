<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameIMG, GameLayer, GameScene } from 'core/constant'

  export let position: number[]

  enum TouchPadSize {
    WIDTH = 164,
    HEIGHT = 88,
  }
  enum Heart {
    X = TouchPadSize.WIDTH - 40,
    Y = TouchPadSize.HEIGHT - 36,
    WIDTH = 32,
    HEIGHT = 28,
  }
  enum Star {
    X = 12,
    Y = TouchPadSize.HEIGHT - 40,
    WIDTH = 32,
    HEIGHT = 30,
  }

  const LAYER = GameLayer.CONTROLLER + 1

  let touchPad: PIXI.Container

  let loadingUI: PIXI.Container
  let loadingIcon: PIXI.Text
  let loadingText: PIXI.Text

  let fightUI: PIXI.Container
  let heart: PIXI.Sprite
  let heartGrey: PIXI.Sprite
  let heartMask: PIXI.Graphics
  let star: PIXI.Sprite
  let starGrey: PIXI.Sprite
  let starMask: PIXI.Graphics

  onMount(() => {
    touchPad = new PIXI.Container()
    touchPad.zIndex = LAYER
    touchPad.position.set(position[0], position[1])
    $gameCtx.controller.addChild(touchPad)

    loadingUI = new PIXI.Container()
    fightUI = new PIXI.Container()
    touchPad.addChild(loadingUI)
    touchPad.addChild(fightUI)

    initFightUI()
    initLoadingUI()

    $gameCtx.app.ticker.add(handleUI)
    $gameCtx.app.ticker.add(handleFighterUI)
  })

  function initLoadingUI() {
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
  }

  function initFightUI() {
    heartGrey = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.HEART_GREY].texture
    )
    heartGrey.zIndex = LAYER
    heartGrey.x = Heart.X
    heartGrey.y = Heart.Y
    fightUI.addChild(heartGrey)

    heart = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.HEART].texture
    )
    heart.zIndex = LAYER + 1
    heart.x = Heart.X
    heart.y = Heart.Y
    fightUI.addChild(heart)

    heartMask = new PIXI.Graphics()
    heartMask
      .beginFill()
      .drawRect(Heart.X, Heart.Y, Heart.WIDTH, Heart.HEIGHT)
      .endFill()
    heart.mask = heartMask
    fightUI.addChild(heartMask)

    starGrey = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.STAR_GREY].texture
    )
    starGrey.zIndex = LAYER
    starGrey.x = Star.X
    starGrey.y = Star.Y
    fightUI.addChild(starGrey)

    star = PIXI.Sprite.from($gameCtx.app.loader.resources[GameIMG.STAR].texture)
    star.zIndex = LAYER + 1
    star.x = Star.X
    star.y = Star.Y
    fightUI.addChild(star)

    starMask = new PIXI.Graphics()
    starMask
      .beginFill()
      .drawRect(Star.X, Star.Y, Star.WIDTH, Star.HEIGHT)
      .endFill()
    star.mask = starMask
    fightUI.addChild(starMask)
  }

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
    const heartRemain =
      (Heart.HEIGHT * $gameCtx.me.health) / $gameCtx.me.maxHealth
    heartMask.clear()
    heartMask
      .beginFill()
      .drawRect(
        Heart.X,
        Heart.Y + Heart.HEIGHT - heartRemain,
        Heart.WIDTH,
        heartRemain
      )
      .endFill()

    const manaRemain = (Star.HEIGHT * $gameCtx.me.mana) / $gameCtx.me.maxMana
    starMask.clear()
    starMask
      .beginFill()
      .drawRect(
        Star.X,
        Star.Y + Star.HEIGHT - manaRemain,
        Star.WIDTH,
        manaRemain
      )
      .endFill()
  }
</script>

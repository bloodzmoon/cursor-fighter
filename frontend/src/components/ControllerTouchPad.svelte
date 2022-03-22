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

  const LAYER = GameLayer.CONTROLLER + 1

  let touchPad: PIXI.Container

  let loadingUI: PIXI.Container
  let loadingIcon: PIXI.Text
  let loadingText: PIXI.Text

  let fightUI: PIXI.Container
  let uiOutline: PIXI.Sprite
  let healthText: PIXI.Text
  let ammoText: PIXI.Text
  let gemSkill1: PIXI.Sprite
  let gemSkill1Mask: PIXI.Graphics
  let gemSkill2: PIXI.Sprite
  let gemSkill2Mask: PIXI.Graphics
  let gemSkillUlt: PIXI.Sprite
  let gemSkillUltMask: PIXI.Graphics

  let resultUI: PIXI.Container
  let resultText1: PIXI.Text
  let resultText2: PIXI.Text

  onMount(() => {
    touchPad = new PIXI.Container()
    touchPad.zIndex = LAYER
    touchPad.position.set(position[0], position[1])
    $gameCtx.controller.addChild(touchPad)

    loadingUI = new PIXI.Container()
    fightUI = new PIXI.Container()
    resultUI = new PIXI.Container()
    touchPad.addChild(loadingUI)
    touchPad.addChild(fightUI)
    touchPad.addChild(resultUI)

    initFightUI()
    initLoadingUI()
    initResultUI()

    $gameCtx.app.ticker.add(handleUI)
    $gameCtx.app.ticker.add(handleFighterUI)
  })

  function initLoadingUI() {
    loadingIcon = new PIXI.Text('{}', {
      fontFamily: 'Pokemon',
      fontSize: 28,
      fill: 0xffffff,
    })
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
    loadingText.anchor.set(0.5)
    loadingText.position.set(
      TouchPadSize.WIDTH / 2,
      TouchPadSize.HEIGHT / 2 + 15
    )
    loadingUI.addChild(loadingText)
  }

  function initFightUI() {
    healthText = new PIXI.Text('', {
      fontFamily: 'Pokemon',
      fill: 0xc4c4c4,
    })
    healthText.anchor.set(1, 0)
    healthText.x = 32
    healthText.y = 46
    fightUI.addChild(healthText)

    ammoText = new PIXI.Text('', {
      fontFamily: 'Pokemon',
      fill: 0xc4c4c4,
    })
    ammoText.x = 134
    ammoText.y = 46
    fightUI.addChild(ammoText)

    gemSkillUlt = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.GEM_SKILL_ULT].texture
    )
    gemSkillUlt.scale.set(0.5)
    gemSkillUlt.x = 68
    gemSkillUlt.y = 12
    fightUI.addChild(gemSkillUlt)

    gemSkillUltMask = new PIXI.Graphics()
    gemSkillUltMask.beginFill().drawRect(68, 12, 26.5, 53).endFill()
    gemSkillUlt.mask = gemSkillUltMask
    fightUI.addChild(gemSkillUltMask)

    gemSkill1 = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.GEM_SKILL].texture
    )
    gemSkill1.scale.set(-0.5, 0.5)
    gemSkill1.x = 66
    gemSkill1.y = 52
    fightUI.addChild(gemSkill1)

    gemSkill1Mask = new PIXI.Graphics()
    gemSkill1Mask.beginFill().drawRect(66, 52, -16.5, 16).endFill()
    gemSkill1.mask = gemSkill1Mask
    fightUI.addChild(gemSkill1Mask)

    gemSkill2 = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.GEM_SKILL].texture
    )
    gemSkill2.scale.set(0.5)
    gemSkill2.x = 98
    gemSkill2.y = 52
    fightUI.addChild(gemSkill2)

    gemSkill2Mask = new PIXI.Graphics()
    gemSkill2Mask.beginFill().drawRect(98, 52, 16.5, 16).endFill()
    gemSkill2.mask = gemSkill2Mask
    fightUI.addChild(gemSkill2Mask)

    uiOutline = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.FIGHT_UI].texture
    )
    uiOutline.scale.set(0.5)
    fightUI.addChild(uiOutline)
  }

  function initResultUI() {
    resultText1 = new PIXI.Text('', {
      fontFamily: 'Pokemon',
      fontSize: 26,
      fill: 0xffffff,
    })
    resultText1.anchor.set(0.5)
    resultText1.position.set(
      TouchPadSize.WIDTH / 2,
      TouchPadSize.HEIGHT / 2 - 15
    )
    resultUI.addChild(resultText1)

    resultText2 = new PIXI.Text('', {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xffffff,
    })
    resultText2.anchor.set(0.5)
    resultText2.position.set(
      TouchPadSize.WIDTH / 2,
      TouchPadSize.HEIGHT / 2 + 15
    )
    resultUI.addChild(resultText2)
  }

  function handleUI(dt: number) {
    if ($gameCtx.isControllerLoading) {
      loadingIcon.rotation += 0.1 * dt
      loadingUI.visible = true
      fightUI.visible = false
      resultUI.visible = false
    } else if ($gameCtx.scene === GameScene.PLAY_DEATH_MATCH) {
      loadingUI.visible = false
      fightUI.visible = true
      resultUI.visible = false

      if ($gameCtx.me.isDead) {
        fightUI.visible = false
        resultUI.visible = true
        resultText1.text = '< GAMEOVER >'
        resultText2.text = 'YOU DIED'
      }
    } else {
      loadingUI.visible = false
      fightUI.visible = false
      resultUI.visible = false
    }
  }

  function handleFighterUI() {
    healthText.text = Math.ceil($gameCtx.me.health).toFixed(0)

    if ($gameCtx.me.isReloading) {
      ammoText.text = '-'
    } else {
      ammoText.text = Math.ceil($gameCtx.me.ammo).toFixed(0)
    }

    const skill1CoolDown =
      (16 * $gameCtx.me.skill1Timer) / $gameCtx.me.skill1CoolDown
    gemSkill1Mask.clear()
    gemSkill1Mask
      .beginFill()
      .drawRect(66, 52 + 16 - skill1CoolDown, -16.5, skill1CoolDown)
      .endFill()

    const skill2CoolDown =
      (16 * $gameCtx.me.skill2Timer) / $gameCtx.me.skill2CoolDown
    gemSkill2Mask.clear()
    gemSkill2Mask
      .beginFill()
      .drawRect(98, 52 + 16 - skill2CoolDown, 16.5, skill2CoolDown)
      .endFill()

    const skillUltCoolDown =
      (53 * $gameCtx.me.skillUltTimer) / $gameCtx.me.skillUltCoolDown
    gemSkillUltMask.clear()
    gemSkillUltMask
      .beginFill()
      .drawRect(68, 12 + 53 - skillUltCoolDown, 26.5, skillUltCoolDown)
      .endFill()
  }
</script>

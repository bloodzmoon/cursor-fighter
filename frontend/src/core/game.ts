import { writable, get } from 'svelte/store'
import { Camera } from 'pixi-game-camera'
import { sound } from '@pixi/sound'
import * as PIXI from 'pixi.js'
import WebFont from 'webfontloader'

import {
  FighterSync,
  GameScene,
  GameLayer,
  GameIMG,
  GameFX,
  GameScreen,
  Attack,
  Fighter,
  FighterType,
  AttackSync,
} from 'core/constant'

// ===== Import assets =====
import controllerImg from 'assets/img/ui/controller.png'
import btn1Img from 'assets/img/ui/btn1.png'
import btn2Img from 'assets/img/ui/btn2.png'
import btn3Img from 'assets/img/ui/btn3.png'
import btn4Img from 'assets/img/ui/btn4.png'
import arrowUpImg from 'assets/img/ui/arrow_t.png'
import arrowRightImg from 'assets/img/ui/arrow_r.png'
import arrowDownImg from 'assets/img/ui/arrow_b.png'
import arrowLeftImg from 'assets/img/ui/arrow_l.png'
import btnTopLeftImg from 'assets/img/ui/btn_top_l.png'
import btnTopRightImg from 'assets/img/ui/btn_top_r.png'
import btnMenuImg from 'assets/img/ui/btn_sel.png'
import btnStickImg from 'assets/img/ui/stick.png'
import blackMonitorImg from 'assets/img/ui/black.png'
import cursor1Img from 'assets/img/cursor/cursor01.png'
import atkPistolImg from 'assets/img/attack/bullet.png'
import fightUiImg from 'assets/img/ui/fight_ui.png'
import gemSkillImg from 'assets/img/ui/skill_ui.png'
import gemSkillUltImg from 'assets/img/ui/skill_ulti_ui.png'

import uiSelectFX from 'assets/audio/ui/ui_select.wav'
import controllerTapFX from 'assets/audio/ui/tap.wav'
import monitorFX from 'assets/audio/ui/ui_monitor.wav'
import pistolFX from 'assets/audio/attack/pistol.wav'
import ammoOutFX from 'assets/audio/attack/ammo_out.wav'
import reloadFX from 'assets/audio/attack/reload.wav'

// ===== Game context =====
export const gameCtx = writable(createGameContext())

function createGameContext() {
  const app = new PIXI.Application({
    width: 1000,
    height: 800,
    backgroundAlpha: 0,
  })
  app.stage.sortableChildren = true

  const camera = new Camera({ ticker: app.ticker })

  const monitor = new PIXI.Container()
  monitor.sortableChildren = true
  monitor.zIndex = GameLayer.MONITOR
  monitor.mask = new PIXI.Graphics().drawRect(
    0,
    0,
    GameScreen.WIDTH,
    GameScreen.HEIGHT
  )
  app.stage.addChild(monitor)

  const controller = new PIXI.Container()
  controller.sortableChildren = true
  controller.zIndex = GameLayer.CONTROLLER
  controller.x = GameScreen.WIDTH / 4
  controller.y = GameScreen.HEIGHT - 80
  app.stage.addChild(controller)

  return {
    isSpriteLoaded: false,
    isAudioLoaded: false,
    isFontLoaded: false,
    isMonitorActive: true,
    isControllerLoading: false,
    isDebug: false,

    scene: GameScene.INIT,
    app,
    camera,
    monitor,
    controller,

    arenaId: '',
    fighters: <Record<string, FighterSync>>{},
    attacks: <Record<string, AttackSync>>{},
    me: <Fighter>{
      _socket: null,
      isDead: false,
      id: '',
      name: '',
      position: [0, 0],
      velocity: [0, 0],
      rotation: 0,
      hitBox: new PIXI.Circle(),
      type: FighterType.ASSULT,
      ammo: 0,
      maxAmmo: 0,
      health: 0,
      maxHealth: 0,
      healthRegen: 0,
      skill1CoolDown: 0,
      skill1Timer: 0,
      skill2CoolDown: 0,
      skill2Timer: 0,
      skillUltCoolDown: 0,
      skillUltTimer: 0,
      fireRate: 0,
      fireTimer: 0,
      isReloading: false,
      reloadDelay: 0,
      reloadTimer: 0,
      speed: 0,
      attacks: <Record<string, Attack>>{},
    },
  }
}

export async function loadAssests() {
  const $gameCtx = get(gameCtx)

  // Load sprite
  await new Promise<void>((resolve) => {
    $gameCtx.app.loader
      .add(GameIMG.CONTROLLER, controllerImg)
      .add(GameIMG.BTN_1, btn1Img)
      .add(GameIMG.BTN_2, btn2Img)
      .add(GameIMG.BTN_3, btn3Img)
      .add(GameIMG.BTN_4, btn4Img)
      .add(GameIMG.BTN_UP, arrowUpImg)
      .add(GameIMG.BTN_RIGHT, arrowRightImg)
      .add(GameIMG.BTN_DOWN, arrowDownImg)
      .add(GameIMG.BTN_LEFT, arrowLeftImg)
      .add(GameIMG.BTN_TL, btnTopLeftImg)
      .add(GameIMG.BTN_TR, btnTopRightImg)
      .add(GameIMG.BTN_MENU, btnMenuImg)
      .add(GameIMG.BTN_STICK, btnStickImg)
      .add(GameIMG.MONITOR_OFF, blackMonitorImg)
      .add(GameIMG.CURSOR_1, cursor1Img)
      .add(GameIMG.ATK_PISTOL, atkPistolImg)
      .add(GameIMG.FIGHT_UI, fightUiImg)
      .add(GameIMG.GEM_SKILL, gemSkillImg)
      .add(GameIMG.GEM_SKILL_ULT, gemSkillUltImg)
      .load()
      .onComplete.once(() => {
        $gameCtx.isSpriteLoaded = true
        gameCtx.set($gameCtx)
        resolve()
      })
  })

  // Load font
  await new Promise<void>((resolve) => {
    WebFont.load({
      custom: {
        families: ['Pokemon'],
      },
      active: () => {
        $gameCtx.isFontLoaded = true
        gameCtx.set($gameCtx)
        resolve()
      },
    })
  })

  // Load sound
  sound.volumeAll = 0.5
  await new Promise<void>((resolve) => {
    $gameCtx.app.loader
      .add(GameFX.UI_SELECT, uiSelectFX)
      .add(GameFX.CONTROLLER_TAP, controllerTapFX)
      .add(GameFX.MONITOR_POWER, monitorFX)
      .add(GameFX.ATK_PISTOL, pistolFX)
      .add(GameFX.AMMO_OUT_PISTOL, ammoOutFX)
      .add(GameFX.RELOAD_PISTOL, reloadFX)
      .load()
      .onComplete.once(() => {
        $gameCtx.isAudioLoaded = true
        gameCtx.set($gameCtx)
        resolve()
      })
  })
}

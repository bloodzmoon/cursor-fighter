import { writable, get } from 'svelte/store'
import * as PIXI from 'pixi.js'
import WebFont from 'webfontloader'
import '@pixi/sound'

import { gameCtx } from 'core/game'
import { controllerCtx } from 'core/controller'

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

import uiSelectFX from 'assets/audio/ui/ui_select.wav'
import controllerTapFX from 'assets/audio/ui/tap.wav'

export const appCtx = writable(createApp())

function createApp() {
  const app = new PIXI.Application({
    width: 1000,
    height: 800,
    backgroundAlpha: 0,
  })

  app.stage.sortableChildren = true
  return app
}

export async function loadAssests() {
  const $appCtx = get(appCtx)
  const $gameCtx = get(gameCtx)
  const $controllerCtx = get(controllerCtx)
  $controllerCtx.isLoading = true
  controllerCtx.set($controllerCtx)

  // Load sprite
  await new Promise<void>((resolve) => {
    $appCtx.loader
      .add('controller', controllerImg)
      .add('btn1', btn1Img)
      .add('btn2', btn2Img)
      .add('btn3', btn3Img)
      .add('btn4', btn4Img)
      .add('arrowUp', arrowUpImg)
      .add('arrowRight', arrowRightImg)
      .add('arrowDown', arrowDownImg)
      .add('arrowLeft', arrowLeftImg)
      .add('btnTopLeft', btnTopLeftImg)
      .add('btnTopRight', btnTopRightImg)
      .add('btnMenu', btnMenuImg)
      .add('btnStick', btnStickImg)
      .add('blackMonitor', blackMonitorImg)
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
  await new Promise<void>((resolve) => {
    $appCtx.loader
      .add('uiSelectFX', uiSelectFX)
      .add('controllerTapFX', controllerTapFX)
      .load()
      .onComplete.once(() => {
        $gameCtx.isAudioLoaded = true
        gameCtx.set($gameCtx)
        resolve()
      })
  })
}

import { writable } from 'svelte/store'
import * as PIXI from 'pixi.js'

import { AppSize, MonitorStage } from 'core/constant'

function createMonitor() {
  const mask = new PIXI.Graphics()
  mask.drawRect(0, 0, AppSize.WIDTH, AppSize.HEIGHT)

  return {
    isActive: true,
    stage: MonitorStage.PLAYING_FFA,
    mask,
  }
}

export const monitorCtx = writable(createMonitor())

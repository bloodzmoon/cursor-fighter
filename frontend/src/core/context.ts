import { writable } from 'svelte/store'
import * as PIXI from 'pixi.js'

const createApp = () => {
  const app = new PIXI.Application({
    width: AppSize.WIDTH,
    height: AppSize.HEIGHT,
    backgroundColor: 0xffffff,
  })
  const background = new PIXI.Graphics()
  background
    .beginFill(0x1a1a1a)
    .drawRect(0, 0, AppSize.WIDTH, AppSize.HEIGHT)
    .endFill()

  app.stage.addChild(background)
  app.stage.interactive = true
  return app
}

export enum AppSize {
  WIDTH = 800,
  HEIGHT = 600,
}

export const appContext = writable(createApp())

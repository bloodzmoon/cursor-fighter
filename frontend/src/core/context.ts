import { writable } from 'svelte/store'
import * as PIXI from 'pixi.js'

const createApp = () => {
  const app = new PIXI.Application({
    width: 1000,
    height: 800,
    backgroundAlpha: 0,
  })
  const background = new PIXI.Graphics()
  background.zIndex = 0
  background
    .beginFill(0xffffff)
    .drawRect(0, 0, AppSize.WIDTH, AppSize.HEIGHT)
    .endFill()

  app.stage.addChild(background)
  app.stage.interactive = true
  app.stage.sortableChildren = true
  return app
}

export enum AppSize {
  WIDTH = 1000,
  HEIGHT = 560,
}

export const appCtx = writable(createApp())
export const controllerCtx = writable()

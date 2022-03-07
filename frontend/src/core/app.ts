import { writable } from 'svelte/store'
import * as PIXI from 'pixi.js'

export const appCtx = writable(createApp())

function createApp() {
  const app = new PIXI.Application({
    width: 1000,
    height: 800,
    backgroundAlpha: 0,
  })

  app.stage.interactive = true
  app.stage.sortableChildren = true
  return app
}

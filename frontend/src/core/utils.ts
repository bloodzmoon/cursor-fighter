import { last, head } from 'lodash'
import { get } from 'svelte/store'

import type { ButtonCode } from 'core/constant'
import { controllerCtx } from 'core/controller'
import { appCtx } from 'core/app'

type ValueOf<T> = T[keyof T]

function radiansToVector(radians: number) {
  return [Math.cos(radians), Math.sin(radians)]
}

function lastEnum<T>(enumObject: T): ValueOf<T> {
  return last(Object.values(enumObject))
}

function firstEnum<T>(enumObject: T): ValueOf<T> {
  return head(Object.values(enumObject))
}

function onButtonClick(buttonCode: ButtonCode, callback: () => void) {
  const $controllerCtx = get(controllerCtx)
  if ($controllerCtx[buttonCode]) {
    $controllerCtx[buttonCode] = false
    controllerCtx.set($controllerCtx)
    callback()
  }
}

function cleanupAppObjects(tickerFunctions: any[], renderedObjects: any[]) {
  const $appCtx = get(appCtx)
  for (const each of tickerFunctions) {
    $appCtx.ticker.remove(each)
  }
  for (const each of renderedObjects) {
    $appCtx.stage.removeChild(each)
  }
}

export default {
  radiansToVector,
  lastEnum,
  firstEnum,
  onButtonClick,
  cleanupAppObjects,
}

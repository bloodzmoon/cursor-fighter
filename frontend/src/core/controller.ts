import { writable } from 'svelte/store'
import { ButtonCode } from './constant'

export const controllerCtx = writable(createController())

function createController(): IControllerContext {
  return {
    [ButtonCode.ARROW_UP]: false,
    [ButtonCode.ARROW_RIGHT]: false,
    [ButtonCode.ARROW_DOWN]: false,
    [ButtonCode.ARROW_LEFT]: false,
    [ButtonCode.SQUARE]: false,
    [ButtonCode.ANALOG_LEFT]: [0, 0],
    [ButtonCode.ANALOG_RIGHT]: 0,
  }
}

type IControllerContext = {
  [ButtonCode.ARROW_UP]: boolean
  [ButtonCode.ARROW_RIGHT]: boolean
  [ButtonCode.ARROW_DOWN]: boolean
  [ButtonCode.ARROW_LEFT]: boolean
  [ButtonCode.SQUARE]: boolean
  [ButtonCode.ANALOG_LEFT]: number[]
  [ButtonCode.ANALOG_RIGHT]: number
}

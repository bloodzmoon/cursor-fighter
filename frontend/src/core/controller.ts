import { writable } from 'svelte/store'
import { ButtonCode } from './constant'

export const controllerCtx = writable(createController())

function createController(): IControllerContext {
  return {
    [ButtonCode.ANALOG_LEFT]: [0, 0],
    [ButtonCode.ANALOG_RIGHT]: 0,
  }
}

type IControllerContext = {
  [ButtonCode.ANALOG_LEFT]: number[]
  [ButtonCode.ANALOG_RIGHT]: number
}

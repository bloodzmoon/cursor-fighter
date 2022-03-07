import type * as PIXI from 'pixi.js'

export enum AppSize {
  WIDTH = 1000,
  HEIGHT = 560,
}

export enum AppLayer {
  BACKGROUND = 1,
  GAME_OBJECT = 5,
  OVERLAY = 20,
  CONTROLLER = 30,
}

export enum ButtonCode {
  TRIANGLE,
  CIRCLE,
  TIMES,
  SQUARE,

  ARROW_UP,
  ARROW_RIGHT,
  ARROW_DOWN,
  ARROW_LEFT,

  ANALOG_LEFT,
  ANALOG_RIGHT,

  TOP_LEFT,
  TOP_RIGHT,

  MENU_LEFT,
  MENU_RIGHT,

  MONITOR_POWER,
}

export enum MonitorStage {
  CREATE_FIGHTER,
  ROOM_LIST,
  LOBBY,
  PLAYING_FFA,
}

export enum AttackType {
  BULLET,
}

export type IAttack = {
  type: AttackType
  velocity: number[]
  object: PIXI.Sprite
}

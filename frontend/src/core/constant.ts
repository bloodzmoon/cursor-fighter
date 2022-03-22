import type * as PIXI from 'pixi.js'

export enum GameScreen {
  WIDTH = 1000,
  HEIGHT = 560,
}

export enum GameLayer {
  // In-game
  BACKGROUND = 1,
  GAME_OBJECT = 5,
  GAME_UI = 10,

  // Outside
  MONITOR = 20,
  CONTROLLER = 30,
}

export const FIGHTER_ID = 'FIGHTER_ID_KEY'

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

export enum GameScene {
  INIT,
  UI_CREATION,
  PLAY_DEATH_MATCH,
}

export enum GameIMG {
  CONTROLLER = 'IMG_CONTROLLER',
  BTN_1 = 'IMG_BTN_1',
  BTN_2 = 'IMG_BTN_2',
  BTN_3 = 'IMG_BTN_3',
  BTN_4 = 'IMG_BTN_4',
  BTN_UP = 'IMG_BTN_UP',
  BTN_RIGHT = 'IMG_BTN_RIGHT',
  BTN_DOWN = 'IMG_BTN_DOWN',
  BTN_LEFT = 'IMG_BTN_LEFT',
  BTN_TL = 'IMG_BTN_TL',
  BTN_TR = 'IMG_BTN_TR',
  BTN_MENU = 'IMG_BTN_MENU',
  BTN_STICK = 'IMG_BTN_STICK',
  MONITOR_OFF = 'IMG_MONITOR_OFF',
  FIGHT_UI = 'IMG_FIGHT_UI',
  GEM_SKILL_ULT = 'IMG_GEM_SKILL_ULT',
  GEM_SKILL = 'IMG_GEM_SKILL',

  CURSOR_1 = 'IMG_CURSOR_1',
  ATK_PISTOL = 'IMG_ATK_PISTOL',
}

export enum GameFX {
  UI_SELECT = 'FX_UI_SELECT',
  CONTROLLER_TAP = 'FX_CONTROLLER_TAP',
  MONITOR_POWER = 'FX_MONITOR_POWER',
  ATK_PISTOL = 'FX_ATK_PISTOL',
  RELOAD_PISTOL = 'FX_RELOAD_PISTOL',
  AMMO_OUT_PISTOL = 'FX_AMMO_OUT_PISTOL',
}

export enum AttackType {
  PISTOL,
}

export type AttackSync = AttackPistolSync

export type BaseAttackSync = {
  id: string
  fighterId: string
  type: AttackType
  velocity: number[]
  rotation: number
  position: number[]
  damage: number
}

export type AttackPistolSync = BaseAttackSync & {
  type: AttackType.PISTOL
  width: number
  height: number
}

export type Attack = AttackPistol

export type BaseAttack = {
  id: string
  fighterId: string
  type: AttackType
  velocity: number[]
  sprite: PIXI.Sprite
  hitBox: PIXI.IShape
  damage: number
  recoil: number[]
}

export type AttackPistol = BaseAttack & {
  type: AttackType.PISTOL
  hitBox: PIXI.Rectangle
}

export type FighterSync = {
  isDead: boolean
  type: FighterType
  id: string
  name: string
  rotation: number
  position: number[]
  hitBoxRadius: number
}

export type Fighter = {
  _socket?: WebSocket
  type: FighterType
  isDead: boolean
  id: string
  name: string
  rotation: number
  position: number[]
  speed: number
  velocity: number[]
  hitBox: PIXI.Circle

  health: number
  maxHealth: number
  healthRegen: number
  skill1CoolDown: number
  skill1Timer: number
  skill2CoolDown: number
  skill2Timer: number
  skillUltCoolDown: number
  skillUltTimer: number
  ammo: number
  maxAmmo: number
  fireRate: number
  fireTimer: number
  reloadDelay: number
  reloadTimer: number
  isReloading: boolean

  attacks: Record<string, Attack>
}

export enum FighterType {
  INIT,
  ASSULT,
}

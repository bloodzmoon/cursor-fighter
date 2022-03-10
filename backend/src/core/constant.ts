export enum FighterType {
  INIT,
  ASSULT,
}

export enum AttackType {
  PISTOL,
}

export type Fighter = {
  type: FighterType
  id: string
  name: string
  rotation: number
  position: number[]
}

export type Attack = {
  fighterId: string
  id: string
  type: AttackType
  velocity: number[]
  rotation: number
  position: number[]
}

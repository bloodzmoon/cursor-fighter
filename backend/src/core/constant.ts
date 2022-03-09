export enum FighterType {
  INIT,
  ASSULT,
}

export type Fighter = {
  type: FighterType
  id: string
  name: string
  rotation: number
  position: number[]
}

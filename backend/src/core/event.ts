import { Attack, Fighter, FighterType } from './constant'

// ME mean client send to server
export enum GameEvent {
  FIRST_JOIN,
  SYNC,
  SYNC_ME,
  HIT,
  HIT_ME,
}

export type MessageObject =
  | GameEventFirstJoin
  | GameEventSync
  | GameEventSyncMe
  | GameEventHit
  | GameEventHitMe

export type GameEventFirstJoin = {
  event: GameEvent.FIRST_JOIN
  payload: {
    arenaId: string
    type: FighterType
    id: string
    name: string
    rotation: number
    position: number[]
  }
}

export type GameEventSync = {
  event: GameEvent.SYNC
  payload: {
    fighters: Record<string, Fighter>
    attacks: Record<string, Attack>
  }
}

export type GameEventSyncMe = {
  event: GameEvent.SYNC_ME
  payload: {
    arenaId: string
    fighter: Fighter
    attacks: Record<string, Attack>
  }
}

export type GameEventHitMe = {
  event: GameEvent.HIT_ME
  payload: {
    arenaId: string
    fighterId: string
    damage: number
    recoil: number[]
  }
}

export type GameEventHit = {
  event: GameEvent.HIT
  payload: {
    damage: number
    recoil: number[]
  }
}

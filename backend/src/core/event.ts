import { Fighter, FighterType } from './constant'

export enum GameEvent {
  FIRST_JOIN,
  SYNC,
  SYNC_ME,
}

export type MessageObject = GameEventFirstJoin | GameEventSync | GameEventSyncMe

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
  }
}

export type GameEventSyncMe = {
  event: GameEvent.SYNC_ME
  payload: {
    arenaId: string
    type: FighterType
    id: string
    rotation: number
    position: number[]
  }
}

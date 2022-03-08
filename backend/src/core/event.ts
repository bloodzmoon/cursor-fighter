import { Fighter } from './game'

export enum GameEvent {
  FIRST_JOIN,
  SYNC,
  SYNC_ME,
}

export type MessageObject = GameEventFirstJoin | GameEventSync | GameEventSyncMe

export type GameEventFirstJoin = {
  event: GameEvent.FIRST_JOIN
  payload: Fighter & { arenaId: string }
}

export type GameEventSync = {
  event: GameEvent.SYNC
  payload: {
    fighters: Record<string, Fighter>
  }
}

export type GameEventSyncMe = {
  event: GameEvent.SYNC_ME
  payload: Fighter & { arenaId: string }
}

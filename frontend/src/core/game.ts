import { writable } from 'svelte/store'

export const gameCtx = writable(createGame())

function createGame() {
  return {
    arenaId: '',
    me: <FighterWithWebSocket>{},
    fighters: <Record<string, Fighter>>{},
  }
}

export type Fighter = {
  id: string
  name: string
  rotation: number
  position: number[]
}

export type FighterWithWebSocket = Fighter & { _socket?: WebSocket }

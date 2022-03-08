import { writable } from 'svelte/store'

export const gameCtx = writable(createGame())

function createGame() {
  return {
    isSpriteLoaded: false,
    isAudioLoaded: false,
    isFontLoaded: false,
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

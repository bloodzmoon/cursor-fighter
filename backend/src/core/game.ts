import { WebSocket, Server } from 'ws'
import { get, mapValues, omit } from 'lodash'

import { GameEvent, MessageObject } from './event'
import { Fighter } from './constant'

export const ARENAS: Record<
  string,
  {
    fighters: Record<string, FighterWithSocket>
  }
> = {}

export type FighterWithSocket = Fighter & { _socket: WebSocket }

const broadcast = (arenaId: string, message: string, sender?: WebSocket) => {
  let fighters = Object.values(get(ARENAS, [arenaId, 'fighters'], {}))
  if (sender) {
    fighters = fighters.filter((f) => f._socket !== sender)
  }
  const sockets = fighters.map((f) => f._socket)
  for (const socket of sockets) {
    socket.send(message)
  }
}

const onFighterJoin = () => {
  console.log('New Fighter has joined the game!')
}

const onFighterLeft = (socket: WebSocket) => {
  for (const [arenaId, { fighters }] of Object.entries(ARENAS)) {
    for (const [fighterId, { _socket, name }] of Object.entries(fighters)) {
      if (_socket === socket) {
        ARENAS[arenaId].fighters = omit(ARENAS[arenaId].fighters, fighterId)
        console.log(`${name} has left the game(${arenaId})`)
        return
      }
    }
  }
}

const onGameEvent = (socket: WebSocket, app: Server, message: string) => {
  const msg: MessageObject = JSON.parse(message)
  switch (msg.event) {
    case GameEvent.FIRST_JOIN: {
      const { arenaId, id, ...fighter } = msg.payload
      console.log(`${fighter.name} has join the game(${arenaId})`)
      const arena = ARENAS[arenaId]

      if (!arena) {
        ARENAS[arenaId] = {
          fighters: { [id]: { id, _socket: socket, ...fighter } },
        }
      } else {
        ARENAS[arenaId] = {
          ...ARENAS[arenaId],
          fighters: {
            ...ARENAS[arenaId].fighters,
            [id]: { id, _socket: socket, ...fighter },
          },
        }
      }

      const response: MessageObject = {
        event: GameEvent.SYNC,
        payload: {
          fighters: mapValues(
            ARENAS[arenaId].fighters,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ _socket, ...fighter }) => fighter
          ),
        },
      }
      broadcast(arenaId, JSON.stringify(response))
      break
    }

    case GameEvent.SYNC_ME: {
      const { arenaId, id, ...fighter } = msg.payload
      const fighters = get(ARENAS, [arenaId, 'fighters'])
      fighters[id] = {
        ...fighters[id],
        ...fighter,
      }

      const response: MessageObject = {
        event: GameEvent.SYNC,
        payload: {
          fighters: mapValues(
            ARENAS[arenaId].fighters,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ _socket, ...fighter }) => fighter
          ),
        },
      }
      broadcast(arenaId, JSON.stringify(response))
      break
    }
  }
}

export default {
  onFighterJoin,
  onFighterLeft,
  onGameEvent,
}

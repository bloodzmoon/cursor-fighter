import { WebSocket, Server } from 'ws'
import { get, mapValues, merge } from 'lodash'

import { GameEvent, MessageObject } from './event'
import { Attack, Fighter } from './constant'

const SYNC_RATE = 60

export const ARENAS: Record<
  string,
  {
    syncInterval: ReturnType<typeof setInterval>
    fighters: Record<string, Fighter & { _socket: WebSocket }>
    attacks: Record<string, Attack>
  }
> = {}

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
        console.log(`${name} has left the game(${arenaId})`)
        delete ARENAS[arenaId].fighters[fighterId]

        // Reset arena when no player remain
        if (!Object.keys(ARENAS[arenaId].fighters).length) {
          clearInterval(ARENAS[arenaId].syncInterval)
          delete ARENAS[arenaId]
        }
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
          syncInterval: initSyncInterval(arenaId),
          fighters: { [id]: { id, _socket: socket, ...fighter } },
          attacks: {},
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
      break
    }

    case GameEvent.SYNC_ME: {
      const { arenaId, fighter, attacks } = msg.payload
      const _fighters = get(ARENAS, [arenaId, 'fighters'])
      const _attacks = get(ARENAS, [arenaId, 'attacks'])

      merge(_fighters[fighter.id], fighter)
      merge(_attacks, attacks)

      // Remove expired attack from arena
      for (const [_attackId, _attack] of Object.entries(_attacks)) {
        if (_attack.fighterId !== fighter.id) continue
        if (Object.keys(attacks).includes(_attackId)) continue

        delete _attacks[_attackId]
      }
      break
    }

    case GameEvent.HIT_ME: {
      const { arenaId, fighterId, damage, recoil } = msg.payload
      const _fighter = get(ARENAS, [arenaId, 'fighters', fighterId])

      const response: MessageObject = {
        event: GameEvent.HIT,
        payload: {
          damage,
          recoil,
        },
      }
      _fighter?._socket.send(JSON.stringify(response))
      break
    }
  }
}

const initSyncInterval = (arenaId: string) => {
  return setInterval(() => {
    const response: MessageObject = {
      event: GameEvent.SYNC,
      payload: {
        fighters: mapValues(
          ARENAS[arenaId].fighters,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ _socket, ...fighter }) => fighter
        ),
        attacks: ARENAS[arenaId].attacks,
      },
    }
    broadcast(arenaId, JSON.stringify(response))
  }, 1000 / SYNC_RATE)
}

export default {
  onFighterJoin,
  onFighterLeft,
  onGameEvent,
}

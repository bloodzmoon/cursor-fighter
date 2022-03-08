import WebSocket from 'ws'

import { PORT } from './constants/common'
import game from './core/game'

const app = new WebSocket.Server({
  port: PORT,
})

app.on('connection', (socket) => {
  game.onFighterJoin(socket)

  socket.on('message', (message) => {
    game.onGameEvent(socket, app, message.toString())
  })

  socket.on('close', () => {
    game.onFighterLeft(socket)
  })
})

app.on('listening', () => {
  console.log(`🚀 App has started on port ${PORT}`)
})

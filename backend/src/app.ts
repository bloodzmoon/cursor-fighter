import WebSocket from 'ws'

import { PORT } from './constants/common'

const app = new WebSocket.Server({
  port: PORT,
})

app.on('connection', (socket) => {
  console.log('Some one has joined the game!')
  socket.send('Hello')

  socket.on('message', (message) => {
    socket.send(`Your msg: ${message.toString()}`)
  })

  socket.on('close', () => {
    console.log('Some one has left the game ._.')
    socket.send('Bye!')
  })
})

app.on('listening', () => {
  console.log(`🚀 App has started on port ${PORT}`)
})

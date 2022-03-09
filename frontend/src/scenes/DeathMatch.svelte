<script lang="ts">
  import { onMount } from 'svelte'
  import { omit } from 'lodash'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'
  import { GameLayer, GameScreen } from 'core/constant'

  import Player from 'components/Player.svelte'
  import OtherPlayer from 'components/OtherPlayer.svelte'

  onMount(() => {
    connectToArena()

    const bg = new PIXI.Graphics()
    bg.zIndex = GameLayer.BACKGROUND
    bg.beginFill(0x21252b)
      .drawRect(0, 0, GameScreen.WIDTH, GameScreen.HEIGHT)
      .endFill()
    $gameCtx.monitor.addChild(bg)
  })

  async function connectToArena() {
    const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)
    $gameCtx.me._socket = socket

    socket.onopen = () => {
      const { _socket, ...fighter } = $gameCtx.me
      const msg: MessageObject = {
        event: GameEvent.FIRST_JOIN,
        payload: {
          ...fighter,
          arenaId: $gameCtx.arenaId,
        },
      }
      socket.send(JSON.stringify(msg))
    }

    socket.onmessage = (message) => {
      const msg: MessageObject = JSON.parse(message.data)
      switch (msg.event) {
        case GameEvent.SYNC:
          const { fighters } = msg.payload
          $gameCtx.fighters = omit(fighters, $gameCtx.me.id)
          break
      }
    }
  }
</script>

<Player />
{#each Object.values($gameCtx.fighters) as fighter (fighter.id)}
  <OtherPlayer {fighter} />
{/each}

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { omit } from 'lodash'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'
  import { GameLayer, GameScreen } from 'core/constant'

  import Fighter from 'components/Fighter.svelte'
  import OtherFighter from 'components/OtherFighter.svelte'

  let bg: PIXI.Graphics

  onMount(() => {
    connectToArena()

    bg = new PIXI.Graphics()
    bg.zIndex = GameLayer.BACKGROUND
    bg.beginFill(0x21252b)
      .drawRect(0, 0, GameScreen.WIDTH, GameScreen.HEIGHT)
      .endFill()
    $gameCtx.app.stage.addChild(bg)
  })

  onDestroy(() => {
    $gameCtx.app.stage.removeChild(bg)
  })

  async function connectToArena() {
    const socket = new WebSocket(import.meta.env.VITE_SOCKET_URL)
    $gameCtx.me._socket = socket

    socket.onopen = () => {
      const msg: MessageObject = {
        event: GameEvent.FIRST_JOIN,
        payload: {
          arenaId: $gameCtx.arenaId,
          id: $gameCtx.me.id,
          type: $gameCtx.me.type,
          name: $gameCtx.me.name,
          position: $gameCtx.me.position,
          rotation: $gameCtx.me.rotation,
        },
      }
      socket.send(JSON.stringify(msg))
      $gameCtx.isControllerLoading = false
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

<Fighter />
{#each Object.values($gameCtx.fighters) as fighter (fighter.id)}
  <OtherFighter {fighter} />
{/each}

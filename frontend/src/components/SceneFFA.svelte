<script lang="ts">
  import { onMount } from 'svelte'
  import { omit } from 'lodash'
  import * as PIXI from 'pixi.js'

  import { AppLayer, AppSize } from 'core/constant'
  import { appCtx } from 'core/app'
  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'
  import { controllerCtx } from 'core/controller'

  import Player from './Player.svelte'
  import OtherPlayer from './OtherPlayer.svelte'

  //   $: console.log('>>', $gameCtx.fighters)

  onMount(() => {
    connectToArena()

    const bg = new PIXI.Graphics()
    bg.zIndex = AppLayer.BACKGROUND
    bg.beginFill(0x21252b)
      .drawRect(0, 0, AppSize.WIDTH, AppSize.HEIGHT)
      .endFill()
    $appCtx.stage.addChild(bg)
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
          $controllerCtx.isLoading = false
          break
      }
    }
  }
</script>

<Player />
{#each Object.values($gameCtx.fighters) as fighter}
  <OtherPlayer fighterId={fighter.id} />
{/each}

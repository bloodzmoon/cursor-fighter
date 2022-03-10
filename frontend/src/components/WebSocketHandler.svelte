<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { mapValues, omit, chain } from 'lodash'

  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'

  onMount(() => {
    initWebSocket()
    $gameCtx.app.ticker.add(handleWebSocket)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleWebSocket)
  })

  function initWebSocket() {
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
          const { fighters, attacks } = msg.payload
          $gameCtx.fighters = omit(fighters, $gameCtx.me.id)
          $gameCtx.attacks = chain(attacks)
            .toPairs()
            .filter(([atkId, atk]) => atk.fighterId !== $gameCtx.me.id)
            .fromPairs()
            .value()
          break
      }
    }
  }

  function handleWebSocket() {
    if ($gameCtx.me._socket.readyState === WebSocket.OPEN) {
      const msg: MessageObject = {
        event: GameEvent.SYNC_ME,
        payload: {
          arenaId: $gameCtx.arenaId,
          fighter: {
            type: $gameCtx.me.type,
            id: $gameCtx.me.id,
            name: $gameCtx.me.name,
            rotation: $gameCtx.me.rotation,
            position: $gameCtx.me.position,
          },
          attacks: mapValues($gameCtx.me.attacks, (atk) => ({
            id: atk.id,
            fighterId: $gameCtx.me.id,
            type: atk.type,
            velocity: atk.velocity,
            rotation: atk.sprite.rotation,
            position: [atk.sprite.x, atk.sprite.y],
          })),
        },
      }
      $gameCtx.me._socket.send(JSON.stringify(msg))
    }
  }
</script>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { boxCircle } from 'intersects'
  import { mapValues, omit, chain, clamp } from 'lodash'
  import { Shake } from 'pixi-game-camera'

  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'
  import { AttackType } from 'core/constant'

  onMount(() => {
    initWebSocket()
    $gameCtx.app.ticker.add(handleWebSocket)
    $gameCtx.app.ticker.add(handleAttackHit)
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
        case GameEvent.SYNC: {
          const { fighters, attacks } = msg.payload

          $gameCtx.fighters = omit(fighters, $gameCtx.me.id)
          $gameCtx.attacks = chain(attacks)
            .toPairs()
            .filter(([_, atk]) => atk.fighterId !== $gameCtx.me.id)
            .fromPairs()
            .value()
          break
        }

        case GameEvent.HIT: {
          const { damage, recoil } = msg.payload
          $gameCtx.me.health = clamp(
            $gameCtx.me.health - damage,
            0,
            $gameCtx.me.maxHealth
          )
          $gameCtx.me.velocity[0] += recoil[0]
          $gameCtx.me.velocity[1] += recoil[1]
          $gameCtx.camera.effect(new Shake($gameCtx.controller, 5, 250))
          break
        }
      }
    }
  }

  function handleWebSocket() {
    if ($gameCtx.me._socket.readyState !== WebSocket.OPEN) return

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
          hitBoxRadius: $gameCtx.me.hitBox.radius,
        },
        attacks: mapValues($gameCtx.me.attacks, (atk) => {
          switch (atk.type) {
            case AttackType.PISTOL: {
              return {
                id: atk.id,
                fighterId: $gameCtx.me.id,
                type: atk.type,
                velocity: atk.velocity,
                rotation: atk.sprite.rotation,
                position: [atk.sprite.x, atk.sprite.y],
                damage: atk.damage,
                width: atk.hitBox.width,
                height: atk.hitBox.height,
              }
            }
          }
        }),
      },
    }
    $gameCtx.me._socket.send(JSON.stringify(msg))
  }

  function handleAttackHit() {
    if ($gameCtx.me._socket.readyState !== WebSocket.OPEN) return

    const attacks = $gameCtx.me.attacks
    const fighters = $gameCtx.fighters

    for (const [attackId, attack] of Object.entries(attacks)) {
      for (const [fighterId, fighter] of Object.entries(fighters)) {
        switch (attack.type) {
          case AttackType.PISTOL: {
            if (
              boxCircle(
                attack.hitBox.x,
                attack.hitBox.y,
                attack.hitBox.width,
                attack.hitBox.height,
                fighter.position[0],
                fighter.position[1],
                fighter.hitBoxRadius
              )
            ) {
              const msg: MessageObject = {
                event: GameEvent.HIT_ME,
                payload: {
                  arenaId: $gameCtx.arenaId,
                  fighterId,
                  damage: attack.damage,
                  recoil: attack.recoil,
                },
              }
              $gameCtx.me._socket.send(JSON.stringify(msg))

              $gameCtx.monitor.removeChild(attack.sprite)
              $gameCtx.me.attacks = omit(attacks, attackId)
            }
            break
          }
        }
      }
    }
  }
</script>

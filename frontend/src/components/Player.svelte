<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import { MotionBlurFilter } from '@pixi/filter-motion-blur'
  import { sound } from '@pixi/sound'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { controllerCtx } from 'core/controller'
  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'
  import {
    GameLayer,
    GameScreen,
    AttackType,
    ButtonCode,
    IAttack,
    GameFX,
    GameIMG,
  } from 'core/constant'
  import utils from 'core/utils'

  let self: PIXI.Sprite
  let name: PIXI.Text
  let speed = 0.1
  let friction = 0.02 // 0 - 1
  let velocity = [0, 0]
  let attacks = <IAttack[]>[]

  onMount(() => {
    self = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.CURSOR_1].texture
    )
    self.zIndex = GameLayer.GAME_OBJECT
    self.x = GameScreen.WIDTH / 2
    self.y = GameScreen.HEIGHT / 2
    self.anchor.set(0.5)
    $gameCtx.monitor.addChild(self)

    name = new PIXI.Text('', {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xfafafa55,
    })
    name.zIndex = GameLayer.GAME_UI
    name.anchor.set(0.5)
    name.text = $gameCtx.me.name
    $gameCtx.monitor.addChild(name)

    $gameCtx.app.ticker.add(handlePlayerMovement)
    $gameCtx.app.ticker.add(handlePlayerAttack)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.app.ticker.remove(handlePlayerAttack)
  })

  function handlePlayerMovement(dt: number) {
    // sync via socket
    if ($gameCtx.me._socket.readyState === WebSocket.OPEN) {
      const { _socket, ...fighter } = $gameCtx.me
      const msg: MessageObject = {
        event: GameEvent.SYNC_ME,
        payload: {
          ...fighter,
          arenaId: $gameCtx.arenaId,
        },
      }
      $gameCtx.me._socket.send(JSON.stringify(msg))
    }

    // player rotation
    self.rotation = $controllerCtx[ButtonCode.ANALOG_RIGHT]
    $gameCtx.me.rotation = self.rotation

    // player movement
    const analogPos = $controllerCtx[ButtonCode.ANALOG_LEFT]
    const controlPos = vec2.add([], analogPos, [self.x, self.y])
    const delta = vec2.sub([], controlPos, [self.x, self.y])
    vec2.normalize(delta, delta)
    vec2.scaleAndAdd(velocity, velocity, delta, speed)

    if (self.x < 0 || self.x > GameScreen.WIDTH) {
      self.x = clamp(self.x, 0, GameScreen.WIDTH)
      velocity[0] *= -1
    }
    if (self.y < 0 || self.y > GameScreen.HEIGHT) {
      self.y = clamp(self.y, 0, GameScreen.HEIGHT)
      velocity[1] *= -1
    }
    velocity[0] *= 1 - friction
    velocity[1] *= 1 - friction
    self.x += velocity[0]
    self.y += velocity[1]
    name.x = self.x
    name.y = self.y + 28
    $gameCtx.me.position = [self.x, self.y]
  }

  function handlePlayerAttack() {
    // Create attack object
    utils.onButtonClick(ButtonCode.SQUARE, () => {
      sound.play(GameFX.ATK_PISTOL)
      const bullet = PIXI.Sprite.from(
        $gameCtx.app.loader.resources[GameIMG.ATK_PISTOL].texture
      )
      bullet.zIndex = GameLayer.GAME_OBJECT
      bullet.anchor.set(0.5)
      bullet.position.set(self.x, self.y)
      bullet.rotation = self.rotation

      const playerVelocity = utils.radiansToVector(self.rotation)
      const bulletVelocity = vec2.scale([], playerVelocity, 20)
      bullet.filters = [new MotionBlurFilter(bulletVelocity)]

      $gameCtx.monitor.addChild(bullet)
      attacks.push({
        type: AttackType.BULLET,
        velocity: bulletVelocity,
        object: bullet,
      })

      // Bullet recoil
      const recoil = vec2.negate([], bulletVelocity)
      vec2.scale(recoil, recoil, 0.01)
      velocity[0] += recoil[0]
      velocity[1] += recoil[1]
    })

    // Attack object movement
    for (const [i, attack] of attacks.entries()) {
      if (attack.type === AttackType.BULLET) {
        attack.object.x += attack.velocity[0]
        attack.object.y += attack.velocity[1]
      }

      // Clean up
      if (
        attack.object.x < 0 ||
        attack.object.x > GameScreen.WIDTH ||
        attack.object.y < 0 ||
        attack.object.y > GameScreen.HEIGHT
      ) {
        $gameCtx.monitor.removeChild(attack.object)
        attacks.splice(i, 1)
      }
    }
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import { MotionBlurFilter } from '@pixi/filter-motion-blur'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx } from 'core/app'
  import {
    AppLayer,
    AppSize,
    AttackType,
    ButtonCode,
    IAttack,
  } from 'core/constant'
  import { controllerCtx } from 'core/controller'
  import { monitorCtx } from 'core/monitor'
  import utils from 'core/utils'

  import cursor01 from 'assets/cursor01.png'
  import bulletImg from 'assets/bullet.png'
  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'

  let self = PIXI.Sprite.from(cursor01)
  let speed = 0.1
  let friction = 0.02 // 0 - 1
  let velocity = [0, 0]
  let attacks = <IAttack[]>[]
  let name = new PIXI.Text('', {
    fontFamily: 'Pokemon',
    fontSize: 20,
    fill: 0xfafafa55,
  })
  let renderedObjects = <any[]>[]
  let tickerFunctions = <any[]>[]

  $: name.text = $gameCtx.me.name

  onMount(() => {
    self.zIndex = AppLayer.GAME_OBJECT
    self.x = AppSize.WIDTH / 2
    self.y = AppSize.HEIGHT / 2
    self.anchor.set(0.5, 0.5)
    self.mask = $monitorCtx.mask
    $appCtx.stage.addChild(self)

    name.zIndex = AppLayer.GAME_OBJECT + 1
    name.anchor.set(0.5)
    name.mask = $monitorCtx.mask
    $appCtx.stage.addChild(name)

    $appCtx.ticker.add(handlePlayerMovement)
    $appCtx.ticker.add(handlePlayerAttack)
  })

  onDestroy(() => {
    utils.cleanupAppObjects(tickerFunctions, renderedObjects)
  })

  function handlePlayerMovement() {
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

    if (self.x < 0 || self.x > AppSize.WIDTH) {
      self.x = clamp(self.x, 0, AppSize.WIDTH)
      velocity[0] *= -1
    }
    if (self.y < 0 || self.y > AppSize.HEIGHT) {
      self.y = clamp(self.y, 0, AppSize.HEIGHT)
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
      const bullet = PIXI.Sprite.from(bulletImg)
      bullet.zIndex = AppLayer.GAME_OBJECT
      bullet.anchor.set(0.5)
      bullet.position.set(self.x, self.y)
      bullet.rotation = self.rotation

      const playerVelocity = utils.radiansToVector(self.rotation)
      const bulletVelocity = vec2.scale([], playerVelocity, 20)
      bullet.filters = [new MotionBlurFilter(bulletVelocity)]

      $appCtx.stage.addChild(bullet)
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
        attack.object.x > AppSize.WIDTH ||
        attack.object.y < 0 ||
        attack.object.y > AppSize.HEIGHT
      ) {
        $appCtx.stage.removeChild(attack.object)
        attacks.splice(i, 1)
      }
    }
  }
</script>

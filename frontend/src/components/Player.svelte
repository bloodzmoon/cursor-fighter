<script lang="ts">
  import { onMount } from 'svelte'
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

  import cursor01 from 'assets/cursor01.png'
  import bulletImg from 'assets/bullet.png'

  let self = PIXI.Sprite.from(cursor01)
  let speed = 0.1
  let friction = 0.02 // 0 - 1
  let velocity = [0, 0]
  let maxVelocity = 2
  let attacks = <IAttack[]>[]

  onMount(() => {
    self.zIndex = AppLayer.GAME_OBJECT
    self.x = AppSize.WIDTH / 2
    self.y = AppSize.HEIGHT / 2
    self.anchor.set(0.5, 0.5)
    self.mask = $monitorCtx.mask

    $appCtx.stage.addChild(self)
    $appCtx.ticker.add(handlePlayerMovement)
    $appCtx.ticker.add(handlePlayerAttack)
  })

  function handlePlayerMovement() {
    // player rotation
    self.rotation = $controllerCtx[ButtonCode.ANALOG_RIGHT]
    // console.log(self.angle)

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
    velocity[0] = clamp(velocity[0], -maxVelocity, maxVelocity)
    velocity[1] = clamp(velocity[1], -maxVelocity, maxVelocity)
    velocity[0] *= 1 - friction
    velocity[1] *= 1 - friction
    self.x += velocity[0]
    self.y += velocity[1]
  }

  function handlePlayerAttack() {
    // Create attack object
    if ($controllerCtx[ButtonCode.SQUARE]) {
      $controllerCtx[ButtonCode.SQUARE] = false

      const bullet = PIXI.Sprite.from(bulletImg)
      bullet.zIndex = AppLayer.GAME_OBJECT
      bullet.anchor.set(0.5)
      bullet.position.set(self.x, self.y)
      bullet.rotation = self.rotation

      const playerVelocity = [Math.cos(self.rotation), Math.sin(self.rotation)]
      const bulletVelocity = vec2.scale([], playerVelocity, 10)
      bullet.filters = [new MotionBlurFilter(bulletVelocity)]

      $appCtx.stage.addChild(bullet)
      attacks.push({
        type: AttackType.BULLET,
        velocity: bulletVelocity,
        object: bullet,
      })

      // Bullet recoil
      const recoil = vec2.mul([], playerVelocity, [-1, -1])
      vec2.scale(recoil, recoil, 0.8)
      velocity[0] += recoil[0]
      velocity[1] += recoil[1]
    }

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

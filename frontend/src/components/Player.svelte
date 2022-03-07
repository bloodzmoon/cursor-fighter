<script lang="ts">
  import { onMount } from 'svelte'
  import { clamp } from 'lodash'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx } from 'core/app'
  import { AppLayer, AppSize, ButtonCode } from 'core/constant'

  import cursor01 from 'assets/cursor01.png'
  import { controllerCtx } from 'core/controller'

  let self = PIXI.Sprite.from(cursor01)
  let speed = 0.1
  let friction = 0.02 // 0 - 1
  let velocity = [0, 0]
  let maxVelocity = 2

  onMount(() => {
    self.zIndex = AppLayer.GAME_OBJECT
    self.x = AppSize.WIDTH / 2
    self.y = AppSize.HEIGHT / 2
    self.anchor.set(0.5, 0.5)

    $appCtx.stage.addChild(self)
    $appCtx.ticker.add(handlePlayerMovement)
  })

  function handlePlayerMovement() {
    // player rotation
    self.rotation = $controllerCtx[ButtonCode.ANALOG_RIGHT]

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
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { controllerCtx } from 'core/controller'
  import { gameCtx } from 'core/game'
  import { GameLayer, ButtonCode, GameIMG, FighterType } from 'core/constant'

  let sprite: PIXI.Sprite
  let name: PIXI.Text
  let interval: ReturnType<typeof setInterval>

  let hitBoxOutline: PIXI.Graphics

  onMount(() => {
    initFighter()
    $gameCtx.app.ticker.add(handlePlayerMovement)
    $gameCtx.app.ticker.add(handleNamePosition)
    $gameCtx.app.ticker.add(debugDraw)
  })

  onDestroy(() => {
    clearInterval(interval)
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.app.ticker.remove(handleNamePosition)
    $gameCtx.app.ticker.remove(debugDraw)
    $gameCtx.monitor.removeChild(sprite)
    $gameCtx.monitor.removeChild(name)
  })

  function initFighter() {
    switch ($gameCtx.me.type) {
      case FighterType.ASSULT: {
        $gameCtx.me.maxHealth = 100
        $gameCtx.me.healthRegen = 0.5
        $gameCtx.me.skill1CoolDown = 4
        $gameCtx.me.skill2CoolDown = 8
        $gameCtx.me.skillUltCoolDown = 30
        $gameCtx.me.maxAmmo = 12
        $gameCtx.me.fireRate = 1.8
        $gameCtx.me.speed = 0.1
        $gameCtx.me.reloadDelay = 2.4
        $gameCtx.me.hitBox.radius = 16

        $gameCtx.me.health = $gameCtx.me.maxHealth
        $gameCtx.me.ammo = $gameCtx.me.maxAmmo
        $gameCtx.me.skill1Timer = 0
        $gameCtx.me.skill2Timer = 0
        $gameCtx.me.skillUltTimer = 0
        $gameCtx.me.fireTimer = 1
        $gameCtx.me.reloadTimer = 0

        sprite = PIXI.Sprite.from(
          $gameCtx.app.loader.resources[GameIMG.CURSOR_1].texture
        )
        break
      }
    }

    sprite.zIndex = GameLayer.GAME_OBJECT
    sprite.anchor.set(0.5)
    $gameCtx.monitor.addChild(sprite)

    const INTERVAL_RATE = 100
    const RATE = 1000 / INTERVAL_RATE
    interval = setInterval(() => {
      handleSkillCoolDown(RATE)
      handleHealthRegen(RATE)
    }, INTERVAL_RATE)

    name = new PIXI.Text($gameCtx.me.name, {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xfafafa55,
    })
    name.zIndex = GameLayer.GAME_UI
    name.anchor.set(0.5)
    $gameCtx.monitor.addChild(name)

    hitBoxOutline = new PIXI.Graphics()
    hitBoxOutline.zIndex = GameLayer.GAME_UI
    $gameCtx.monitor.addChild(hitBoxOutline)
  }

  function handlePlayerMovement() {
    const { position, rotation, velocity, speed } = $gameCtx.me

    // player rotation
    $gameCtx.me.rotation = $controllerCtx[ButtonCode.ANALOG_RIGHT]

    // player movement
    const analogPos = $controllerCtx[ButtonCode.ANALOG_LEFT]
    const controlPos = vec2.add([], analogPos, position)
    const delta = vec2.sub([], controlPos, position)
    vec2.normalize(delta, delta)
    $gameCtx.me.velocity = vec2.scaleAndAdd([], velocity, delta, speed)

    $gameCtx.me.position[0] += velocity[0]
    $gameCtx.me.position[1] += velocity[1]
    $gameCtx.me.velocity[0] *= 0.98
    $gameCtx.me.velocity[1] *= 0.98
    $gameCtx.me.hitBox.x = position[0]
    $gameCtx.me.hitBox.y = position[1]

    // Update sprite
    sprite.rotation = rotation
    sprite.x = position[0]
    sprite.y = position[1]
  }

  function handleHealthRegen(rate: number) {
    $gameCtx.me.health = clamp(
      $gameCtx.me.health + $gameCtx.me.healthRegen / rate,
      0,
      $gameCtx.me.maxHealth
    )
  }

  function handleSkillCoolDown(rate: number) {
    $gameCtx.me.skill1Timer = clamp(
      $gameCtx.me.skill1Timer + 1 / rate,
      0,
      $gameCtx.me.skill1CoolDown
    )

    $gameCtx.me.skill2Timer = clamp(
      $gameCtx.me.skill2Timer + 1 / rate,
      0,
      $gameCtx.me.skill2CoolDown
    )

    $gameCtx.me.skillUltTimer = clamp(
      $gameCtx.me.skillUltTimer + 1 / rate,
      0,
      $gameCtx.me.skillUltCoolDown
    )

    $gameCtx.me.reloadTimer = clamp(
      $gameCtx.me.reloadTimer + 1 / rate,
      0,
      $gameCtx.me.reloadDelay
    )

    $gameCtx.me.fireTimer = clamp(
      $gameCtx.me.fireTimer + (1 / rate) * $gameCtx.me.fireRate,
      0,
      1
    )
  }

  function handleNamePosition() {
    name.x = $gameCtx.me.position[0]
    name.y = $gameCtx.me.position[1] + 28
  }

  function debugDraw() {
    if (!$gameCtx.isDebug) {
      hitBoxOutline.clear()
      return
    }

    hitBoxOutline
      .clear()
      .beginFill(0x00ff00, 0.3)
      .drawShape($gameCtx.me.hitBox)
      .endFill()
  }
</script>

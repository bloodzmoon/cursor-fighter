<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { controllerCtx } from 'core/controller'
  import { gameCtx } from 'core/game'
  import {
    GameLayer,
    GameScreen,
    ButtonCode,
    GameIMG,
    FighterType,
  } from 'core/constant'

  let self: PIXI.Sprite
  let name: PIXI.Text
  let healthRegenInterval: ReturnType<typeof setInterval>
  let skillInterval: ReturnType<typeof setInterval>

  onMount(() => {
    initFighter()
    $gameCtx.app.ticker.add(handlePlayerMovement)
    $gameCtx.app.ticker.add(handleNamePosition)
  })

  onDestroy(() => {
    clearInterval(healthRegenInterval)
    clearInterval(skillInterval)
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.app.ticker.remove(handleNamePosition)
    $gameCtx.monitor.removeChild(self)
    $gameCtx.monitor.removeChild(name)
  })

  function initFighter() {
    switch ($gameCtx.me.type) {
      case FighterType.ASSULT: {
        $gameCtx.me.maxHealth = 100
        $gameCtx.me.healthRegen = 2
        $gameCtx.me.skill1CoolDown = 4
        $gameCtx.me.skill2CoolDown = 8
        $gameCtx.me.skillUltCoolDown = 30
        $gameCtx.me.maxAmmo = 12
        $gameCtx.me.fireRate = 1.6
        $gameCtx.me.speed = 0.1
        $gameCtx.me.reloadDelay = 2.4

        $gameCtx.me.health = $gameCtx.me.maxHealth
        $gameCtx.me.ammo = $gameCtx.me.maxAmmo
        $gameCtx.me.skill1Timer = 0
        $gameCtx.me.skill2Timer = 0
        $gameCtx.me.skillUltTimer = 0
        $gameCtx.me.fireTimer = 1
        $gameCtx.me.reloadTimer = 0

        self = PIXI.Sprite.from(
          $gameCtx.app.loader.resources[GameIMG.CURSOR_1].texture
        )
        self.zIndex = GameLayer.GAME_OBJECT
        self.x = GameScreen.WIDTH / 2
        self.y = GameScreen.HEIGHT / 2
        self.anchor.set(0.5)
        $gameCtx.monitor.addChild(self)
        break
      }
    }

    skillInterval = setInterval(handleSkillCoolDown, 100)
    healthRegenInterval = setInterval(handleHealthRegen, 1000)
    name = new PIXI.Text($gameCtx.me.name, {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xfafafa55,
    })
    name.zIndex = GameLayer.GAME_UI
    name.anchor.set(0.5)
    name.text = $gameCtx.me.name
    $gameCtx.monitor.addChild(name)
  }

  function handlePlayerMovement() {
    // player rotation
    self.rotation = $controllerCtx[ButtonCode.ANALOG_RIGHT]
    $gameCtx.me.rotation = self.rotation

    // player movement
    const velocity = $gameCtx.me.velocity
    const analogPos = $controllerCtx[ButtonCode.ANALOG_LEFT]
    const controlPos = vec2.add([], analogPos, [self.x, self.y])
    const delta = vec2.sub([], controlPos, [self.x, self.y])
    vec2.normalize(delta, delta)
    vec2.scaleAndAdd(velocity, velocity, delta, $gameCtx.me.speed)

    if (self.x < 0 || self.x > GameScreen.WIDTH) {
      self.x = clamp(self.x, 0, GameScreen.WIDTH)
      velocity[0] *= -1
    }
    if (self.y < 0 || self.y > GameScreen.HEIGHT) {
      self.y = clamp(self.y, 0, GameScreen.HEIGHT)
      velocity[1] *= -1
    }
    velocity[0] *= 0.98
    velocity[1] *= 0.98
    self.x += velocity[0]
    self.y += velocity[1]

    $gameCtx.me.position = [self.x, self.y]
    $gameCtx.me.velocity = velocity
  }

  function handleHealthRegen() {
    $gameCtx.me.health = clamp(
      $gameCtx.me.health + $gameCtx.me.healthRegen,
      0,
      $gameCtx.me.maxHealth
    )
  }

  function handleSkillCoolDown() {
    $gameCtx.me.skill1Timer = clamp(
      $gameCtx.me.skill1Timer + 0.1,
      0,
      $gameCtx.me.skill1CoolDown
    )

    $gameCtx.me.skill2Timer = clamp(
      $gameCtx.me.skill2Timer + 0.1,
      0,
      $gameCtx.me.skill2CoolDown
    )

    $gameCtx.me.skillUltTimer = clamp(
      $gameCtx.me.skillUltTimer + 0.1,
      0,
      $gameCtx.me.skillUltCoolDown
    )

    $gameCtx.me.reloadTimer = clamp(
      $gameCtx.me.reloadTimer + 0.1,
      0,
      $gameCtx.me.reloadDelay
    )

    $gameCtx.me.fireTimer = clamp(
      $gameCtx.me.fireTimer + 0.1 * $gameCtx.me.fireRate,
      0,
      1
    )
  }

  function handleNamePosition() {
    name.x = $gameCtx.me.position[0]
    name.y = $gameCtx.me.position[1] + 28
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { controllerCtx } from 'core/controller'
  import { gameCtx } from 'core/game'
  import { GameEvent, MessageObject } from 'core/event'
  import {
    GameLayer,
    GameScreen,
    ButtonCode,
    GameIMG,
    FighterType,
  } from 'core/constant'

  import AttackManager from 'components/AttackManager.svelte'

  let self: PIXI.Sprite
  let name: PIXI.Text

  onMount(() => {
    $gameCtx.app.ticker.addOnce(handleFighterStat)
    $gameCtx.app.ticker.add(handlePlayerMovement)
    $gameCtx.app.ticker.add(handleNamePosition)
    $gameCtx.app.ticker.add(handleWebSocket)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleWebSocket)
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.monitor.removeChild(self)
    $gameCtx.monitor.removeChild(name)
  })

  function handleFighterStat() {
    switch ($gameCtx.me.type) {
      case FighterType.ASSULT: {
        $gameCtx.me.maxHealth = 100
        $gameCtx.me.healthRegen = 5
        $gameCtx.me.maxMana = 50
        $gameCtx.me.manaRegen = 5
        $gameCtx.me.maxAmmo = 12
        $gameCtx.me.fireRate = 1
        $gameCtx.me.speed = 0.1
        $gameCtx.me.health = $gameCtx.me.maxHealth
        $gameCtx.me.mana = $gameCtx.me.maxMana
        $gameCtx.me.ammo = $gameCtx.me.maxAmmo

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

  function handleNamePosition() {
    name.x = $gameCtx.me.position[0]
    name.y = $gameCtx.me.position[1] + 28
  }

  function handleWebSocket() {
    if ($gameCtx.me._socket.readyState === WebSocket.OPEN) {
      const msg: MessageObject = {
        event: GameEvent.SYNC_ME,
        payload: {
          arenaId: $gameCtx.arenaId,
          type: $gameCtx.me.type,
          id: $gameCtx.me.id,
          rotation: $gameCtx.me.rotation,
          position: $gameCtx.me.position,
        },
      }
      $gameCtx.me._socket.send(JSON.stringify(msg))
    }
  }
</script>

<AttackManager />

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { boxCircle, boxBox } from 'intersects'
  import { clamp, omit } from 'lodash'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { AttackType, GameLayer, GameScreen } from 'core/constant'

  import WebSocketHandler from 'components/WebSocketHandler.svelte'
  import Fighter from 'components/Fighter.svelte'
  import FighterAttack from 'components/FighterAttack.svelte'
  import Enemy from 'components/Enemy.svelte'
  import EnemyAttack from 'components/EnemyAttack.svelte'

  let bg: PIXI.Sprite
  let hitBoxTop: PIXI.Rectangle
  let hitBoxRight: PIXI.Rectangle
  let hitBoxBottom: PIXI.Rectangle
  let hitBoxLeft: PIXI.Rectangle
  let hitBoxOutline: PIXI.Graphics

  onMount(() => {
    initScene()
    initCamera()

    $gameCtx.app.ticker.add(handleCameraMovement)
    $gameCtx.app.ticker.add(handlePlayerOutOfMap)
    $gameCtx.app.ticker.add(handleAttackOutOfMap)
    $gameCtx.app.ticker.add(debugDraw)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleCameraMovement)
    $gameCtx.app.ticker.remove(handlePlayerOutOfMap)
    $gameCtx.app.ticker.remove(handleAttackOutOfMap)
    $gameCtx.app.ticker.remove(debugDraw)
    $gameCtx.app.stage.removeChild(bg)
  })

  function initScene() {
    const renderer = $gameCtx.app.renderer
    const texture = renderer.generateTexture(
      new PIXI.Graphics()
        .beginFill(0x21252b)
        .drawRect(0, 0, GameScreen.WIDTH, GameScreen.HEIGHT)
        .endFill()
    )
    bg = PIXI.Sprite.from(texture)
    bg.zIndex = GameLayer.BACKGROUND
    $gameCtx.monitor.addChild(bg)

    const BORDER_SIZE = 30
    hitBoxTop = new PIXI.Rectangle(
      0,
      -BORDER_SIZE,
      GameScreen.WIDTH,
      BORDER_SIZE
    )
    hitBoxRight = new PIXI.Rectangle(
      GameScreen.WIDTH,
      0,
      BORDER_SIZE,
      GameScreen.HEIGHT
    )
    hitBoxBottom = new PIXI.Rectangle(
      0,
      GameScreen.HEIGHT,
      GameScreen.WIDTH,
      BORDER_SIZE
    )
    hitBoxLeft = new PIXI.Rectangle(
      -BORDER_SIZE,
      0,
      BORDER_SIZE,
      GameScreen.HEIGHT
    )
    hitBoxOutline = new PIXI.Graphics()
    hitBoxOutline.zIndex = GameLayer.GAME_UI
    $gameCtx.monitor.addChild(hitBoxOutline)

    $gameCtx.me.position[0] = GameScreen.WIDTH / 2
    $gameCtx.me.position[1] = GameScreen.HEIGHT / 2
  }

  function initCamera() {
    $gameCtx.monitor.pivot.x = GameScreen.WIDTH / 2
    $gameCtx.monitor.pivot.y = GameScreen.HEIGHT / 2
    $gameCtx.monitor.position.x = GameScreen.WIDTH / 2
    $gameCtx.monitor.position.y = GameScreen.HEIGHT / 2
  }

  function handleCameraMovement() {
    $gameCtx.monitor.pivot.x = $gameCtx.me.position[0]
    $gameCtx.monitor.pivot.y = $gameCtx.me.position[1]
  }

  function handlePlayerOutOfMap() {
    const player = $gameCtx.me.hitBox

    $gameCtx.me.position[0] = clamp(
      $gameCtx.me.position[0],
      0,
      GameScreen.WIDTH
    )
    $gameCtx.me.position[1] = clamp(
      $gameCtx.me.position[1],
      0,
      GameScreen.HEIGHT
    )

    if (
      boxCircle(
        hitBoxRight.x,
        hitBoxRight.y,
        hitBoxRight.width,
        hitBoxRight.height,
        player.x,
        player.y,
        player.radius
      ) ||
      boxCircle(
        hitBoxLeft.x,
        hitBoxLeft.y,
        hitBoxLeft.width,
        hitBoxLeft.height,
        player.x,
        player.y,
        player.radius
      )
    ) {
      $gameCtx.me.velocity[0] *= -1
    }

    if (
      boxCircle(
        hitBoxTop.x,
        hitBoxTop.y,
        hitBoxTop.width,
        hitBoxTop.height,
        player.x,
        player.y,
        player.radius
      ) ||
      boxCircle(
        hitBoxBottom.x,
        hitBoxBottom.y,
        hitBoxBottom.width,
        hitBoxBottom.height,
        player.x,
        player.y,
        player.radius
      )
    ) {
      $gameCtx.me.velocity[1] *= -1
    }
  }

  function handleAttackOutOfMap() {
    const attacks = $gameCtx.me.attacks
    for (const [attackId, attack] of Object.entries(attacks)) {
      switch (attack.type) {
        case AttackType.PISTOL: {
          if (
            boxBox(
              hitBoxTop.x,
              hitBoxTop.y,
              hitBoxTop.width,
              hitBoxTop.height,
              attack.hitBox.x,
              attack.hitBox.y,
              attack.hitBox.width,
              attack.hitBox.height
            ) ||
            boxBox(
              hitBoxRight.x,
              hitBoxRight.y,
              hitBoxRight.width,
              hitBoxRight.height,
              attack.hitBox.x,
              attack.hitBox.y,
              attack.hitBox.width,
              attack.hitBox.height
            ) ||
            boxBox(
              hitBoxBottom.x,
              hitBoxBottom.y,
              hitBoxBottom.width,
              hitBoxBottom.height,
              attack.hitBox.x,
              attack.hitBox.y,
              attack.hitBox.width,
              attack.hitBox.height
            ) ||
            boxBox(
              hitBoxLeft.x,
              hitBoxLeft.y,
              hitBoxLeft.width,
              hitBoxLeft.height,
              attack.hitBox.x,
              attack.hitBox.y,
              attack.hitBox.width,
              attack.hitBox.height
            )
          ) {
            $gameCtx.monitor.removeChild(attack.sprite)
            $gameCtx.me.attacks = omit(attacks, attackId)
          }
          break
        }
      }
    }
  }

  function debugDraw() {
    if (!$gameCtx.isDebug) {
      hitBoxOutline.clear()
      return
    }

    hitBoxOutline
      .clear()
      .beginFill(0x00ff00, 0.3)
      .drawShape(hitBoxTop)
      .drawShape(hitBoxRight)
      .drawShape(hitBoxBottom)
      .drawShape(hitBoxLeft)
      .endFill()
  }
</script>

<WebSocketHandler />
<Fighter />
<FighterAttack />
{#each Object.values($gameCtx.fighters) as fighter (fighter.id)}
  <Enemy {fighter} />
{/each}
{#each Object.values($gameCtx.attacks) as attack (attack.id)}
  <EnemyAttack {attack} />
{/each}

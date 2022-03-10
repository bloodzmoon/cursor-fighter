<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { GameLayer, GameScreen } from 'core/constant'

  import WebSocketHandler from 'components/WebSocketHandler.svelte'
  import Fighter from 'components/Fighter.svelte'
  import FighterAttack from 'components/FighterAttack.svelte'
  import Enemy from 'components/Enemy.svelte'
  import EnemyAttack from 'components/EnemyAttack.svelte'

  let bg: PIXI.Sprite

  onMount(() => {
    initScene()
    initCamera()

    $gameCtx.app.ticker.add(handleCameraMovement)
  })

  onDestroy(() => {
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

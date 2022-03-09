<script lang="ts">
  import { onMount } from 'svelte'
  import { sound } from '@pixi/sound'
  import * as PIXI from 'pixi.js'

  import {
    GameScreen,
    GameScene,
    GameLayer,
    GameIMG,
    GameFX,
  } from 'core/constant'
  import { gameCtx } from 'core/game'

  import Button from 'components/Button.svelte'
  import SceneInit from 'scenes/Init.svelte'
  import SceneCreation from 'scenes/Creation.svelte'
  import SceneDeathMatch from 'scenes/DeathMatch.svelte'

  let blackScreen: PIXI.Sprite

  onMount(() => {
    const html = document.getElementById('app')
    html.append($gameCtx.app.view)

    blackScreen = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.MONITOR_OFF].texture
    )
    blackScreen.zIndex = GameLayer.MONITOR + 1
    $gameCtx.app.stage.addChild(blackScreen)
    $gameCtx.app.ticker.add(handleBlackScreen)
  })

  function handleBlackScreen() {
    blackScreen.visible = !$gameCtx.isMonitorActive
  }

  function turnScreenOnOff() {
    $gameCtx.isMonitorActive = !$gameCtx.isMonitorActive
    sound.play(GameFX.MONITOR_POWER, { volume: 0.2 })
  }
</script>

<div
  class="monitor"
  style="width: {GameScreen.WIDTH}px; height: {GameScreen.HEIGHT}px;"
/>
<div
  class="monitor-power"
  class:active={$gameCtx.isMonitorActive}
  style="left: {GameScreen.WIDTH - 10}px; top: {GameScreen.HEIGHT + 4}px"
/>
<Button
  sprite={GameIMG.BTN_MENU}
  position={[GameScreen.WIDTH - 24, GameScreen.HEIGHT + 8]}
  angle={90}
  onClick={turnScreenOnOff}
/>
{#if $gameCtx.scene === GameScene.INIT}
  <SceneInit />
{:else if $gameCtx.scene === GameScene.UI_CREATION}
  <SceneCreation />
{:else if $gameCtx.scene === GameScene.PLAY_DEATH_MATCH}
  <SceneDeathMatch />
{/if}

<style>
  .monitor {
    position: absolute;
    z-index: -2;
    top: 0;
    left: 0;

    outline: 16px solid var(--blue600);
    background: black;
  }

  .monitor-power {
    position: absolute;
    z-index: -1;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: crimson;
  }

  .monitor-power.active {
    background: greenyellow;
  }
</style>

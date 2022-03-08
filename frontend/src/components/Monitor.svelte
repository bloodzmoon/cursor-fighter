<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx } from 'core/app'
  import { monitorCtx } from 'core/monitor'
  import { AppLayer, AppSize, MonitorStage } from 'core/constant'

  import Button from './Button.svelte'
  import SceneCreateFighter from './SceneCreateFighter.svelte'
  import SceneFFA from './SceneFFA.svelte'
  import { gameCtx } from 'core/game'
  import { controllerCtx } from 'core/controller'

  let blackScreen = PIXI.Sprite.from(
    $appCtx.loader.resources['blackMonitor'].texture
  )

  $: renderBlackScreen($monitorCtx.isActive)

  onMount(() => {
    const appContainer = document.getElementById('app')
    appContainer.prepend($appCtx.view)

    blackScreen.zIndex = AppLayer.OVERLAY

    $appCtx.ticker.add(checkLoadingProcess)
  })

  function checkLoadingProcess() {
    if (
      $gameCtx.isAudioLoaded &&
      $gameCtx.isFontLoaded &&
      $gameCtx.isSpriteLoaded
    ) {
      $controllerCtx.isLoading = false
      $monitorCtx.stage = MonitorStage.CREATE_FIGHTER
      $appCtx.ticker.remove(checkLoadingProcess)
    }
  }

  function renderBlackScreen(isActive: boolean) {
    if (!isActive) {
      $appCtx.stage.addChild(blackScreen)
    } else {
      $appCtx.stage.removeChild(blackScreen)
    }
  }

  function turnScreenOnOff() {
    $monitorCtx.isActive = !$monitorCtx.isActive
  }
</script>

<div
  class="monitor"
  style="width: {AppSize.WIDTH}px; height: {AppSize.HEIGHT}px;"
/>
<Button
  sprite="btnMenu"
  position={[AppSize.WIDTH - 20, AppSize.HEIGHT + 8]}
  rotation={(90 * Math.PI) / 180}
  onClick={turnScreenOnOff}
/>
{#if $monitorCtx.stage === MonitorStage.CREATE_FIGHTER}
  <SceneCreateFighter />
{:else if $monitorCtx.stage === MonitorStage.PLAYING_FFA}
  <SceneFFA />
{/if}

<style>
  .monitor {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;

    outline: 16px solid var(--blue600);
    background: black;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx } from 'core/app'
  import { monitorCtx } from 'core/monitor'
  import { AppLayer, AppSize, MonitorStage } from 'core/constant'
  import btnImg from 'assets/btn_sel.png'
  import blackImg from 'assets/black.png'

  import SceneCreateFighter from './SceneCreateFighter.svelte'
  import Button from './Button.svelte'

  $: renderBlackScreen($monitorCtx.isActive)
  let blackScreen = PIXI.Sprite.from(blackImg)

  onMount(() => {
    const appContainer = document.getElementById('app')
    appContainer.prepend($appCtx.view)

    blackScreen.zIndex = AppLayer.OVERLAY
  })

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
  sprite={btnImg}
  position={[AppSize.WIDTH - 20, AppSize.HEIGHT + 8]}
  rotation={(90 * Math.PI) / 180}
  onClick={turnScreenOnOff}
/>
{#if $monitorCtx.stage === MonitorStage.CREATE_FIGHTER}
  <SceneCreateFighter />
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

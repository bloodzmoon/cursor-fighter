<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import * as PIXI from 'pixi.js'

  import { AppLayer, AppSize, ButtonCode, MonitorStage } from 'core/constant'
  import { appCtx } from 'core/app'
  import { monitorCtx } from 'core/monitor'
  import { controllerCtx } from 'core/controller'
  import { gameCtx } from 'core/game'
  import utils from 'core/utils'

  import btn2Img from 'assets/btn2.png'

  enum Focus {
    FIGHTER_NAME,
    ARENA_ID,
  }

  let currentFocus = Focus.FIGHTER_NAME
  let fighterNameRef: HTMLInputElement
  let fighterName = ''
  let arenaIdRef: HTMLInputElement
  let arenaId = ''
  let renderedObjects = <any[]>[]
  let tickerFunctions = <any[]>[]

  onMount(() => {
    const bg = new PIXI.Graphics()
    bg.zIndex = AppLayer.BACKGROUND
    bg.beginFill(0x21252b)
      .drawRect(0, 0, AppSize.WIDTH, AppSize.HEIGHT)
      .endFill()
    $appCtx.stage.addChild(bg)
    renderedObjects.push(bg)

    const btnYes = PIXI.Sprite.from(btn2Img)
    btnYes.zIndex = AppLayer.GAME_OBJECT
    btnYes.scale.set(0.45)
    btnYes.anchor.set(0.5)
    btnYes.position.set(AppSize.WIDTH / 2 - 90, 400)
    $appCtx.stage.addChild(btnYes)
    renderedObjects.push(btnYes)

    $appCtx.ticker.add(handleUI)
    tickerFunctions.push(handleUI)
  })

  onDestroy(() => {
    utils.cleanupAppObjects(tickerFunctions, renderedObjects)
  })

  function handleUI() {
    // Handle focus
    utils.onButtonClick(ButtonCode.ARROW_UP, () => {
      currentFocus = clamp(
        currentFocus - 1,
        utils.firstEnum(Focus),
        utils.lastEnum(Focus)
      )
    })
    utils.onButtonClick(ButtonCode.ARROW_DOWN, () => {
      currentFocus = clamp(
        currentFocus + 1,
        utils.firstEnum(Focus),
        utils.lastEnum(Focus)
      )
    })
    utils.onButtonClick(ButtonCode.CIRCLE, () => {
      if (!fighterName.trim().length) {
        currentFocus = Focus.FIGHTER_NAME
        return
      }
      if (!arenaId.trim().length) {
        currentFocus = Focus.ARENA_ID
        return
      }

      // Go to next scene
      $controllerCtx.isLoading = true
      $monitorCtx.stage = MonitorStage.PLAYING_FFA
      $gameCtx.arenaId = arenaId
      $gameCtx.me = {
        ...$gameCtx.me,
        name: fighterName,
      }
    })

    // Render UI
    if (currentFocus === Focus.FIGHTER_NAME) {
      fighterNameRef?.focus()
    }
    if (currentFocus === Focus.ARENA_ID) {
      arenaIdRef?.focus()
    }
  }
</script>

{#if $monitorCtx.isActive}
  <span class="label fighter-name">[ Fighter Name ]</span>
  <input
    bind:this={fighterNameRef}
    bind:value={fighterName}
    class="input fighter-name"
    placeholder="Enter Fighter Name"
  />
  <span class="label arena-id">[ Arena ID ]</span>
  <input
    bind:this={arenaIdRef}
    bind:value={arenaId}
    class="input arena-id"
    placeholder="Enter Arena ID"
  />
  <span class="label confirm-btn">Go to area!</span>
{/if}

<style>
  .input {
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 40px;

    border-radius: 4px;
    border: none;
    padding: 0 0.5rem;
    text-align: center;

    font-family: inherit;
    font-size: 24px;
  }

  .input:focus {
    outline: 4px solid var(--blue400);
  }

  .label {
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, -50%);

    color: white;
    font-size: 32px;
  }

  .input.fighter-name {
    top: 160px;
    left: 500px;
  }

  .label.fighter-name {
    top: 120px;
    left: 500px;
  }

  .input.arena-id {
    top: 300px;
    left: 500px;
  }

  .label.arena-id {
    top: 260px;
    left: 500px;
  }

  .label.confirm-btn {
    top: 400px;
    left: 500px;
  }
</style>

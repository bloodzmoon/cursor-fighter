<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { clamp } from 'lodash'
  import { sound } from '@pixi/sound'
  import * as PIXI from 'pixi.js'

  import {
    GameLayer,
    GameScreen,
    GameScene,
    ButtonCode,
    GameIMG,
    GameFX,
  } from 'core/constant'
  import { gameCtx } from 'core/game'
  import utils from 'core/utils'

  enum Focus {
    FIGHTER_NAME,
    ARENA_ID,
  }

  let currentFocus = Focus.FIGHTER_NAME
  let fighterNameRef: HTMLInputElement
  let fighterName = ''
  let arenaIdRef: HTMLInputElement
  let arenaId = ''

  onMount(() => {
    const bg = new PIXI.Graphics()
    bg.zIndex = GameLayer.BACKGROUND
    bg.beginFill(0x21252b)
      .drawRect(0, 0, GameScreen.WIDTH, GameScreen.HEIGHT)
      .endFill()
    $gameCtx.monitor.addChild(bg)

    const btnYes = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.BTN_2].texture
    )
    btnYes.zIndex = GameLayer.GAME_OBJECT
    btnYes.scale.set(0.45)
    btnYes.anchor.set(0.5)
    btnYes.position.set(GameScreen.WIDTH / 2 - 90, 400)
    $gameCtx.monitor.addChild(btnYes)

    $gameCtx.app.ticker.add(handleScene)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleScene)
    $gameCtx.monitor.removeChildren()
  })

  function handleScene() {
    // Handle focus
    utils.onButtonClick(ButtonCode.ARROW_UP, () => {
      sound.play(GameFX.UI_SELECT, { volume: 0.5 })
      currentFocus = clamp(
        currentFocus - 1,
        utils.firstEnum(Focus),
        utils.lastEnum(Focus)
      )
    })
    utils.onButtonClick(ButtonCode.ARROW_DOWN, () => {
      sound.play(GameFX.UI_SELECT, { volume: 0.5 })
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
      $gameCtx.isControllerLoading = true
      $gameCtx.scene = GameScene.PLAY_DEATH_MATCH
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

{#if $gameCtx.isMonitorActive}
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

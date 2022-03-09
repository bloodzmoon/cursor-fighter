<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  import { gameCtx } from 'core/game'
  import { GameScene } from 'core/constant'

  onMount(() => {
    $gameCtx.app.ticker.add(handleScene)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleScene)
  })

  function handleScene() {
    if (
      $gameCtx.isSpriteLoaded &&
      $gameCtx.isFontLoaded &&
      $gameCtx.isAudioLoaded
    ) {
      $gameCtx.scene = GameScene.UI_CREATION
    }
  }
</script>

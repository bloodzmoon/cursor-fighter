<script lang="ts">
  import { onMount } from 'svelte'
  import { nanoid } from 'nanoid'

  import { FIGHTER_ID } from 'core/constant'

  import Monitor from 'components/Monitor.svelte'
  import Controller from 'components/Controller.svelte'
  import { gameCtx } from 'core/game'
  import { loadAssests } from 'core/app'

  onMount(() => {
    loadAssests()

    const fighterId = localStorage.getItem(FIGHTER_ID)
    if (fighterId) {
      $gameCtx.me.id = fighterId
      return
    }

    const newFighterId = nanoid(10)
    localStorage.setItem(FIGHTER_ID, newFighterId)
    $gameCtx.me.id = newFighterId
  })
</script>

{#if $gameCtx.isSpriteLoaded && $gameCtx.isFontLoaded}
  <Monitor />
  <Controller />
{/if}

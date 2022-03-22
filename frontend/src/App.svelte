<script lang="ts">
  import { onMount } from 'svelte'
  import { nanoid } from 'nanoid'

  import { FIGHTER_ID } from 'core/constant'
  import { gameCtx, loadAssests } from 'core/game'

  import Monitor from 'components/Monitor.svelte'
  import Controller from 'components/Controller.svelte'

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

{#if $gameCtx.isSpriteLoaded && $gameCtx.isFontLoaded && $gameCtx.isAudioLoaded}
  <Monitor />
  <Controller />
{:else}
  <div class="loader">{`{}`}</div>
{/if}

<span id="version">
  version 1.0.0
  <br />
  Created by
  <a href="https://github.com/bloodzmoon" target="_blank">Bloodzmoon</a>
</span>

<style>
  .loader {
    color: var(--light100);
    font-size: 72px;
    animation: spin 0.5s infinite linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  #version {
    position: fixed;
    color: white;
    bottom: 2rem;
    right: 1rem;
    text-align: right;
  }

  #version a {
    color: inherit;
    text-decoration: none;
  }

  #version a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>

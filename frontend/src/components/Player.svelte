<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appContext } from '../core/context'
  import cursor01 from '../assets/cursor01.png'

  onMount(() => {
    const cursor = PIXI.Sprite.from(cursor01)

    $appContext.stage.addChild(cursor)
    $appContext.stage.on('pointermove', (e) => {
      const pos = e.data.global
      cursor.x = pos.x
      cursor.y = pos.y
    })
  })
</script>

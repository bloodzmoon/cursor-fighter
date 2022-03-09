<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { MotionBlurFilter } from '@pixi/filter-motion-blur'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { gameCtx } from 'core/game'
  import { GameLayer, GameScreen, Fighter, GameIMG } from 'core/constant'

  export let fighter: Fighter

  let self: PIXI.Sprite
  let name: PIXI.Text

  onMount(() => {
    self = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.CURSOR_1].texture
    )
    self.zIndex = GameLayer.GAME_OBJECT
    self.anchor.set(0.5)
    $gameCtx.monitor.addChild(self)

    name = new PIXI.Text(fighter.name, {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xfafafa55,
    })
    name.zIndex = GameLayer.GAME_UI
    name.anchor.set(0.5)
    $gameCtx.monitor.addChild(name)

    $gameCtx.app.ticker.add(handlePlayerMovement)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.monitor.removeChild(self)
    $gameCtx.monitor.removeChild(name)
  })

  function handlePlayerMovement() {
    console.log('>>', fighter)

    // player rotation
    self.rotation = fighter.rotation

    // player movement
    self.x = fighter.position[0]
    self.y = fighter.position[1]
    name.x = self.x
    name.y = self.y + 28
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import {
    GameLayer,
    GameScreen,
    FighterSync,
    GameIMG,
    FighterType,
  } from 'core/constant'

  export let fighter: FighterSync

  let self: PIXI.Sprite
  let name: PIXI.Text

  let hitBox: PIXI.Circle
  let hitBoxOutline: PIXI.Graphics

  onMount(() => {
    initFighter()
    $gameCtx.app.ticker.add(handlePlayerMovement)
    $gameCtx.app.ticker.add(handleNamePosition)
    $gameCtx.app.ticker.add(debugDraw)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.app.ticker.remove(handleNamePosition)
    $gameCtx.app.ticker.remove(debugDraw)
    $gameCtx.monitor.removeChild(self)
    $gameCtx.monitor.removeChild(name)
    $gameCtx.monitor.removeChild(hitBoxOutline)
  })

  function initFighter() {
    switch (fighter.type) {
      case FighterType.ASSULT: {
        self = PIXI.Sprite.from(
          $gameCtx.app.loader.resources[GameIMG.CURSOR_1].texture
        )
        self.zIndex = GameLayer.GAME_OBJECT
        self.x = GameScreen.WIDTH / 2
        self.y = GameScreen.HEIGHT / 2
        self.anchor.set(0.5)
        $gameCtx.monitor.addChild(self)

        hitBox = new PIXI.Circle(0, 0, 16)
        hitBoxOutline = new PIXI.Graphics()
        hitBoxOutline.zIndex = GameLayer.GAME_UI
        $gameCtx.monitor.addChild(hitBoxOutline)
        break
      }
    }

    name = new PIXI.Text(fighter.name, {
      fontFamily: 'Pokemon',
      fontSize: 20,
      fill: 0xfafafa55,
    })
    name.zIndex = GameLayer.GAME_UI
    name.anchor.set(0.5)
    $gameCtx.monitor.addChild(name)
  }

  function handlePlayerMovement() {
    // player rotation
    self.rotation = fighter.rotation

    // player movement
    self.x = fighter.position[0]
    self.y = fighter.position[1]
    hitBox.x = self.x
    hitBox.y = self.y
  }

  function handleNamePosition() {
    name.x = self.x
    name.y = self.y + 28
  }

  function debugDraw() {
    if (!$gameCtx.isDebug) {
      hitBoxOutline.clear()
      return
    }

    hitBoxOutline.clear().beginFill(0x00ff00, 0.3).drawShape(hitBox).endFill()
  }
</script>

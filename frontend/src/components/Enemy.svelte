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

  let sprite: PIXI.Sprite
  let name: PIXI.Text

  let hitBox: PIXI.Circle
  let hitBoxOutline: PIXI.Graphics

  onMount(() => {
    initFighter()
    $gameCtx.app.ticker.add(handlePlayerMovement)
    $gameCtx.app.ticker.add(handleNamePosition)
    $gameCtx.app.ticker.add(handlePlayerDead)
    $gameCtx.app.ticker.add(debugDraw)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handlePlayerMovement)
    $gameCtx.app.ticker.remove(handleNamePosition)
    $gameCtx.app.ticker.remove(debugDraw)
    $gameCtx.monitor.removeChild(sprite)
    $gameCtx.monitor.removeChild(name)
    $gameCtx.monitor.removeChild(hitBoxOutline)
  })

  function initFighter() {
    switch (fighter.type) {
      case FighterType.ASSULT: {
        sprite = PIXI.Sprite.from(
          $gameCtx.app.loader.resources[GameIMG.CURSOR_1].texture
        )
        sprite.zIndex = GameLayer.GAME_OBJECT
        sprite.x = GameScreen.WIDTH / 2
        sprite.y = GameScreen.HEIGHT / 2
        sprite.anchor.set(0.5)
        $gameCtx.monitor.addChild(sprite)

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
    sprite.rotation = fighter.rotation

    // player movement
    sprite.x = fighter.position[0]
    sprite.y = fighter.position[1]
    hitBox.x = sprite.x
    hitBox.y = sprite.y
  }

  function handleNamePosition() {
    name.x = sprite.x
    name.y = sprite.y + 28
  }

  function handlePlayerDead() {
    if (fighter.isDead) {
      const deadFilter = new PIXI.filters.ColorMatrixFilter()
      deadFilter.brightness(0.2, false)
      sprite.filters = [deadFilter]
    }
  }

  function debugDraw() {
    if (!$gameCtx.isDebug) {
      hitBoxOutline.clear()
      return
    }

    hitBoxOutline.clear().beginFill(0x00ff00, 0.3).drawShape(hitBox).endFill()
  }
</script>

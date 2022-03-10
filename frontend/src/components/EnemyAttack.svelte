<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { sound } from '@pixi/sound'
  import { MotionBlurFilter } from '@pixi/filter-motion-blur'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import {
    AttackSync,
    AttackType,
    GameFX,
    GameIMG,
    GameLayer,
  } from 'core/constant'

  export let attack: AttackSync

  let self: PIXI.Sprite

  onMount(() => {
    initAttack()
    $gameCtx.app.ticker.add(handleAttackMovement)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleAttackMovement)
    $gameCtx.monitor.removeChild(self)
  })

  function initAttack() {
    switch (attack.type) {
      case AttackType.PISTOL: {
        sound.play(GameFX.ATK_PISTOL, { volume: 0.5 })

        self = PIXI.Sprite.from(
          $gameCtx.app.loader.resources[GameIMG.ATK_PISTOL].texture
        )
        self.zIndex = GameLayer.GAME_OBJECT
        self.anchor.set(0.5)
        self.position.set(attack.position[0], attack.position[1])
        self.rotation = attack.rotation
        self.filters = [new MotionBlurFilter(attack.velocity)]
        $gameCtx.monitor.addChild(self)
        break
      }
    }
  }

  function handleAttackMovement() {
    switch (attack.type) {
      case AttackType.PISTOL: {
        self.x = attack.position[0]
        self.y = attack.position[1]
        break
      }
    }
  }
</script>

<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { sound } from '@pixi/sound'
  import { MotionBlurFilter } from '@pixi/filter-motion-blur'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { gameCtx } from 'core/game'
  import {
    AttackType,
    ButtonCode,
    FighterType,
    GameFX,
    GameIMG,
    GameLayer,
    GameScreen,
  } from 'core/constant'
  import utils from 'core/utils'

  onMount(() => {
    $gameCtx.app.ticker.add(handleCreateAttack)
    $gameCtx.app.ticker.add(handleAttackMovement)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleCreateAttack)
    $gameCtx.app.ticker.remove(handleAttackMovement)
  })

  function handleCreateAttack() {
    utils.onButtonClick(ButtonCode.SQUARE, () => {
      switch ($gameCtx.me.type) {
        case FighterType.ASSULT: {
          const ATK_SPEED = 20
          const ATK_RECOIL = 0.01

          sound.play(GameFX.ATK_PISTOL, { volume: 0.5 })
          const fighter = $gameCtx.me
          const fighterVector = utils.radiansToVector(fighter.rotation)
          const atkVector = vec2.scale([], fighterVector, ATK_SPEED)

          const atk = PIXI.Sprite.from(
            $gameCtx.app.loader.resources[GameIMG.ATK_PISTOL].texture
          )
          atk.zIndex = GameLayer.GAME_OBJECT
          atk.anchor.set(0.5)
          atk.position.set(fighter.position[0], fighter.position[1])
          atk.rotation = fighter.rotation
          atk.filters = [new MotionBlurFilter(atkVector)]

          $gameCtx.monitor.addChild(atk)
          $gameCtx.attacks.push({
            fighterId: $gameCtx.me.id,
            type: AttackType.PISTOL,
            sprite: atk,
            velocity: atkVector,
          })

          const recoil = vec2.negate([], atkVector)
          vec2.scale(recoil, recoil, ATK_RECOIL)
          $gameCtx.me.velocity[0] += recoil[0]
          $gameCtx.me.velocity[1] += recoil[1]
          break
        }
      }
    })
  }

  function handleAttackMovement() {
    for (const [i, attack] of $gameCtx.attacks.entries()) {
      switch (attack.type) {
        case AttackType.PISTOL: {
          $gameCtx.attacks[i].sprite.x += attack.velocity[0]
          $gameCtx.attacks[i].sprite.y += attack.velocity[1]

          // clean up TODO: change to collision detect
          if (
            attack.sprite.x < 0 ||
            attack.sprite.x > GameScreen.WIDTH ||
            attack.sprite.y < 0 ||
            attack.sprite.y > GameScreen.HEIGHT
          ) {
            $gameCtx.monitor.removeChild(attack.sprite)
            $gameCtx.attacks.splice(i, 1)
          }
          break
        }
      }
    }
  }
</script>

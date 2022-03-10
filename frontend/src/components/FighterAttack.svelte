<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { nanoid } from 'nanoid'
  import { clamp, omit } from 'lodash'
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
    $gameCtx.app.ticker.add(handleReloadAttack)
  })

  onDestroy(() => {
    $gameCtx.app.ticker.remove(handleCreateAttack)
    $gameCtx.app.ticker.remove(handleAttackMovement)
    $gameCtx.app.ticker.remove(handleReloadAttack)
  })

  function handleCreateAttack() {
    utils.onButtonClick(ButtonCode.SQUARE, () => {
      if ($gameCtx.me.isReloading || $gameCtx.me.fireTimer !== 1) return

      switch ($gameCtx.me.type) {
        case FighterType.ASSULT: {
          if ($gameCtx.me.ammo === 0) {
            sound.play(GameFX.AMMO_OUT_PISTOL)
            break
          }

          const ATK_SPEED = 20
          const ATK_RECOIL = 0.01

          sound.play(GameFX.ATK_PISTOL, { volume: 0.5 })
          $gameCtx.me.ammo = clamp($gameCtx.me.ammo - 1, 0, $gameCtx.me.maxAmmo)
          $gameCtx.me.fireTimer = 0

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
          const attackId = nanoid(10)
          $gameCtx.me.attacks[attackId] = {
            id: attackId,
            fighterId: fighter.id,
            type: AttackType.PISTOL,
            sprite: atk,
            velocity: atkVector,
          }

          const recoil = vec2.negate([], atkVector)
          vec2.scale(recoil, recoil, ATK_RECOIL)
          $gameCtx.me.velocity[0] += recoil[0]
          $gameCtx.me.velocity[1] += recoil[1]
          break
        }
      }
    })
  }

  function handleReloadAttack() {
    utils.onButtonClick(ButtonCode.TOP_RIGHT, () => {
      if ($gameCtx.me.isReloading) return

      switch ($gameCtx.me.type) {
        case FighterType.ASSULT: {
          $gameCtx.me.isReloading = true
          $gameCtx.me.reloadTimer = 0
          sound.play(GameFX.AMMO_OUT_PISTOL)
          break
        }
      }
    })

    if (
      $gameCtx.me.isReloading &&
      $gameCtx.me.reloadTimer === $gameCtx.me.reloadDelay
    ) {
      $gameCtx.me.isReloading = false
      $gameCtx.me.ammo = $gameCtx.me.maxAmmo
      sound.play(GameFX.RELOAD_PISTOL)
    }
  }

  function handleAttackMovement() {
    for (const [attackId, attack] of Object.entries($gameCtx.me.attacks)) {
      switch (attack.type) {
        case AttackType.PISTOL: {
          $gameCtx.me.attacks[attackId].sprite.x += attack.velocity[0]
          $gameCtx.me.attacks[attackId].sprite.y += attack.velocity[1]

          // clean up TODO: change to collision detect
          if (
            attack.sprite.x < 0 ||
            attack.sprite.x > GameScreen.WIDTH ||
            attack.sprite.y < 0 ||
            attack.sprite.y > GameScreen.HEIGHT
          ) {
            $gameCtx.monitor.removeChild(attack.sprite)
            $gameCtx.me.attacks = omit($gameCtx.me.attacks, attackId)
          }
          break
        }
      }
    }
  }
</script>

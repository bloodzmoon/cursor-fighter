<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { nanoid } from 'nanoid'
  import { clamp } from 'lodash'
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
          const ATK_DAMAGE = 12

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
          const hitBox = new PIXI.Rectangle(atk.x, atk.y, 12, 4)

          const recoil = vec2.negate([], atkVector)
          vec2.scale(recoil, recoil, ATK_RECOIL)

          const attackId = nanoid(10)
          $gameCtx.me.attacks[attackId] = {
            id: attackId,
            fighterId: fighter.id,
            type: AttackType.PISTOL,
            sprite: atk,
            hitBox,
            velocity: atkVector,
            recoil: vec2.scale([], atkVector, ATK_RECOIL),
            damage: ATK_DAMAGE,
          }

          $gameCtx.monitor.addChild(atk)
          $gameCtx.me.velocity[0] += recoil[0]
          $gameCtx.me.velocity[1] += recoil[1]
          break
        }
      }
    })

    utils.onButtonClick(ButtonCode.MENU_LEFT, () => {
      $gameCtx.isDebug = !$gameCtx.isDebug
      console.log('DEBUG', $gameCtx.isDebug)
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
          const { hitBox } = $gameCtx.me.attacks[attackId]
          $gameCtx.me.attacks[attackId].hitBox.x += attack.velocity[0]
          $gameCtx.me.attacks[attackId].hitBox.y += attack.velocity[1]
          $gameCtx.me.attacks[attackId].sprite.x = hitBox.x
          $gameCtx.me.attacks[attackId].sprite.y = hitBox.y
          break
        }
      }
    }
  }
</script>

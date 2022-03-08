<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { get } from 'lodash'
  import { MotionBlurFilter } from '@pixi/filter-motion-blur'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx } from 'core/app'
  import {
    AppLayer,
    AppSize,
    AttackType,
    ButtonCode,
    IAttack,
  } from 'core/constant'
  import { monitorCtx } from 'core/monitor'
  import utils from 'core/utils'

  import cursor01 from 'assets/cursor01.png'
  import bulletImg from 'assets/bullet.png'
  import { Fighter, gameCtx } from 'core/game'

  export let fighterId: string
  export let fighterName: string

  let self = PIXI.Sprite.from(cursor01)
  let attacks = <IAttack[]>[]
  let name = new PIXI.Text(fighterName, {
    fontFamily: 'Pokemon',
    fontSize: 20,
    fill: 0xfafafa55,
  })
  let renderedObjects = <any[]>[]
  let tickerFunctions = <any[]>[]

  $: name.text = fighterName

  onMount(() => {
    self.zIndex = AppLayer.GAME_OBJECT
    self.x = AppSize.WIDTH / 2
    self.y = AppSize.HEIGHT / 2
    self.anchor.set(0.5, 0.5)
    self.mask = $monitorCtx.mask
    $appCtx.stage.addChild(self)
    renderedObjects.push(self)

    name.zIndex = AppLayer.GAME_OBJECT + 1
    name.anchor.set(0.5)
    name.mask = $monitorCtx.mask
    $appCtx.stage.addChild(name)
    renderedObjects.push(name)

    $appCtx.ticker.add(handlePlayerMovement)
    tickerFunctions.push(handlePlayerMovement)
    //   $appCtx.ticker.add(handlePlayerAttack)
  })

  onDestroy(() => {
    utils.cleanupAppObjects(tickerFunctions, renderedObjects)
  })

  function handlePlayerMovement() {
    const fighter = get($gameCtx.fighters, fighterId, <Fighter>{})

    // player rotation
    self.rotation = fighter.rotation

    // player movement
    self.x = fighter.position[0]
    self.y = fighter.position[1]
    name.x = self.x
    name.y = self.y + 28
  }

  function handlePlayerAttack() {
    // Create attack object
    utils.onButtonClick(ButtonCode.SQUARE, () => {
      const bullet = PIXI.Sprite.from(bulletImg)
      bullet.zIndex = AppLayer.GAME_OBJECT
      bullet.anchor.set(0.5)
      bullet.position.set(self.x, self.y)
      bullet.rotation = self.rotation

      const playerVelocity = utils.radiansToVector(self.rotation)
      const bulletVelocity = vec2.scale([], playerVelocity, 20)
      bullet.filters = [new MotionBlurFilter(bulletVelocity)]

      $appCtx.stage.addChild(bullet)
      attacks.push({
        type: AttackType.BULLET,
        velocity: bulletVelocity,
        object: bullet,
      })
    })

    // Attack object movement
    for (const [i, attack] of attacks.entries()) {
      if (attack.type === AttackType.BULLET) {
        attack.object.x += attack.velocity[0]
        attack.object.y += attack.velocity[1]
      }

      // Clean up
      if (
        attack.object.x < 0 ||
        attack.object.x > AppSize.WIDTH ||
        attack.object.y < 0 ||
        attack.object.y > AppSize.HEIGHT
      ) {
        $appCtx.stage.removeChild(attack.object)
        attacks.splice(i, 1)
      }
    }
  }
</script>

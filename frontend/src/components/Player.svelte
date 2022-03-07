<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'
  import vec2 from 'gl-vec2'

  import { appCtx, AppSize } from '../core/context'
  import cursor01 from '../assets/cursor01.png'

  let isClicked = false
  let isInScreen = false
  let mX = 0
  let mY = 0

  let clickX = 0
  let clickY = 0

  let maxVelocity = 1.6
  let playerSpeed = 0.1
  let playerRotateSpeed = 0.02
  let playerVelocity = [0, 0]

  onMount(() => {
    const player = PIXI.Sprite.from(cursor01)
    player.x = AppSize.WIDTH / 2
    player.y = AppSize.HEIGHT / 2
    player.anchor.set(0.5, 0.5)
    $appCtx.stage.addChild(player)

    const playerName = new PIXI.Text('bloodzmmon', {
      fontSize: 11,
      fill: 'lightskyblue',
    })
    playerName.anchor.set(0.5, 0.5)
    playerName.x = player.x
    playerName.y = player.y + 30
    $appCtx.stage.addChild(playerName)

    // player movement
    $appCtx.ticker.add(() => {
      if (isClicked) {
        const delta = vec2.sub([], [clickX, clickY], [player.x, player.y])
        const length = vec2.len(delta)
        if (length > 10 * 2) {
          vec2.normalize(delta, delta)
          vec2.scaleAndAdd(playerVelocity, playerVelocity, delta, playerSpeed)
        }
      }

      if (player.x < 0 || player.x > AppSize.WIDTH) {
        player.x = Math.max(0, Math.min(AppSize.WIDTH, player.x))
        playerVelocity[0] *= -1
      }
      if (player.y < 0 || player.y > AppSize.HEIGHT) {
        player.y = Math.max(0, Math.min(AppSize.HEIGHT, player.y))
        playerVelocity[1] *= -1
      }
      playerVelocity[0] = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, playerVelocity[0])
      )
      playerVelocity[1] = Math.max(
        -maxVelocity,
        Math.min(maxVelocity, playerVelocity[1])
      )
      playerVelocity[0] *= 0.98
      playerVelocity[1] *= 0.98
      player.x += playerVelocity[0]
      player.y += playerVelocity[1]
      playerName.x = player.x
      playerName.y = player.y + 30
    })

    // player rotation
    $appCtx.ticker.add(() => {
      player.rotation += playerRotateSpeed * 0.98
    })

    $appCtx.stage.on('mousedown', (e: PIXI.InteractionEvent) => {
      isClicked = true

      let pos = e.data.global
      clickX = pos.x
      clickY = pos.y
    })
    $appCtx.stage.on('mouseup', () => {
      isClicked = false
    })
    $appCtx.stage.on('mouseover', () => {
      isInScreen = true
    })
    $appCtx.stage.on('mouseout', () => {
      isInScreen = false
    })
    $appCtx.stage.on('pointermove', (e: PIXI.InteractionEvent) => {
      let pos = e.data.global
      mX = pos.x
      mY = pos.y

      if (!isClicked) return
      clickX = pos.x
      clickY = pos.y
    })
  })
</script>

<p>
  FPS: {$appCtx.ticker.FPS.toFixed(2)} isInScreen: {isInScreen} / isClick: {isClicked}
  / X: {mX} / Y: {mY}
</p>

<style>
  p {
    color: white;
    position: absolute;
    top: 20px;
    left: 20px;
  }
</style>

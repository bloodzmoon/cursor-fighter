<script lang="ts">
  import { onMount } from 'svelte'
  import { sound } from '@pixi/sound'
  import * as PIXI from 'pixi.js'

  import { gameCtx } from 'core/game'
  import { controllerCtx } from 'core/controller'
  import { GameLayer, ButtonCode, GameIMG, GameFX } from 'core/constant'

  import Button from 'components/Button.svelte'
  import ControllerStick from 'components/ControllerStick.svelte'
  import ControllerTouchPad from 'components/ControllerTouchPad.svelte'

  const RIGHT_PAD = [408, 94]
  const LEFT_PAD = [92, 94]
  const TOUCH_PAD = [168, 20]
  const BTN_PAD_GAP = 32

  onMount(() => {
    const controller = PIXI.Sprite.from(
      $gameCtx.app.loader.resources[GameIMG.CONTROLLER].texture
    )
    controller.scale.set(0.5)
    $gameCtx.controller.addChild(controller)
  })

  function handleButtonClick(code: ButtonCode) {
    $controllerCtx[code] = true
    sound.play(GameFX.CONTROLLER_TAP)
  }
</script>

<!-- Right pad -->
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_1}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.TRIANGLE)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_2}
  position={[RIGHT_PAD[0] + BTN_PAD_GAP, RIGHT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.CIRCLE)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_3}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] + BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.TIMES)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_4}
  position={[RIGHT_PAD[0] - BTN_PAD_GAP, RIGHT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.SQUARE)}
/>

<!-- Left pad -->
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_UP}
  position={[LEFT_PAD[0], LEFT_PAD[1] - BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_UP)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_RIGHT}
  position={[LEFT_PAD[0] + BTN_PAD_GAP, LEFT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_RIGHT)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_DOWN}
  position={[LEFT_PAD[0], LEFT_PAD[1] + BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_DOWN)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_LEFT}
  position={[LEFT_PAD[0] - BTN_PAD_GAP, LEFT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_LEFT)}
/>

<!-- Special button -->
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_TL}
  position={[LEFT_PAD[0], LEFT_PAD[1] - 80]}
  onClick={() => handleButtonClick(ButtonCode.TOP_LEFT)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_TR}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - 80]}
  onClick={() => handleButtonClick(ButtonCode.TOP_RIGHT)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_MENU}
  position={[LEFT_PAD[0] + 66, LEFT_PAD[1] - 56]}
  onClick={() => handleButtonClick(ButtonCode.MENU_LEFT)}
/>
<Button
  container={$gameCtx.controller}
  layer={GameLayer.CONTROLLER + 1}
  sprite={GameIMG.BTN_MENU}
  position={[RIGHT_PAD[0] - 66, RIGHT_PAD[1] - 56]}
  onClick={() => handleButtonClick(ButtonCode.MENU_RIGHT)}
/>

<!-- Stick control -->
<ControllerStick
  code={ButtonCode.ANALOG_LEFT}
  position={[LEFT_PAD[0] + 79, LEFT_PAD[1] + 72]}
/>
<ControllerStick
  code={ButtonCode.ANALOG_RIGHT}
  position={[RIGHT_PAD[0] - 77, RIGHT_PAD[1] + 70]}
/>

<!-- Touch pad -->
<ControllerTouchPad position={TOUCH_PAD} />

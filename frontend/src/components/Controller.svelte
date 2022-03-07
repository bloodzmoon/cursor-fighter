<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx } from 'core/app'
  import { AppSize, AppLayer, ButtonCode } from 'core/constant'
  import Button from 'components/Button.svelte'
  import ControllerStick from './ControllerStick.svelte'

  import controllerImg from 'assets/controller.png'
  import btn1Img from 'assets/btn1.png'
  import btn2Img from 'assets/btn2.png'
  import btn3Img from 'assets/btn3.png'
  import btn4Img from 'assets/btn4.png'
  import arrowUpImg from 'assets/arrow_t.png'
  import arrowRightImg from 'assets/arrow_r.png'
  import arrowDownImg from 'assets/arrow_b.png'
  import arrowLeftImg from 'assets/arrow_l.png'
  import btnTopLeftImg from 'assets/btn_top_l.png'
  import btnTopRightImg from 'assets/btn_top_r.png'
  import btnMenuImg from 'assets/btn_sel.png'
  import btnStickImg from 'assets/stick.png'
  import { controllerCtx } from 'core/controller'

  const RIGHT_PAD = [AppSize.WIDTH / 2 + 158, AppSize.HEIGHT + 12]
  const LEFT_PAD = [AppSize.WIDTH / 2 - 158, AppSize.HEIGHT + 12]
  const BTN_PAD_GAP = 32

  onMount(() => {
    const controller = PIXI.Sprite.from(controllerImg)
    controller.position.set(AppSize.WIDTH / 2, AppSize.HEIGHT)
    controller.anchor.set(0.5, 0.25)
    controller.scale.set(0.5)
    controller.zIndex = AppLayer.CONTROLLER

    $appCtx.stage.addChild(controller)
  })

  function handleButtonClick(code: ButtonCode) {
    $controllerCtx[code] = true
  }
</script>

<!-- Right pad -->
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn1Img}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - BTN_PAD_GAP]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn2Img}
  position={[RIGHT_PAD[0] + BTN_PAD_GAP, RIGHT_PAD[1]]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn3Img}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] + BTN_PAD_GAP]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn4Img}
  position={[RIGHT_PAD[0] - BTN_PAD_GAP, RIGHT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.SQUARE)}
/>

<!-- Left pad -->
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowUpImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] - BTN_PAD_GAP]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowRightImg}
  position={[LEFT_PAD[0] + BTN_PAD_GAP, LEFT_PAD[1]]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowDownImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] + BTN_PAD_GAP]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowLeftImg}
  position={[LEFT_PAD[0] - BTN_PAD_GAP, LEFT_PAD[1]]}
/>

<!-- Special button -->
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnTopLeftImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] - 80]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnTopRightImg}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - 80]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnMenuImg}
  position={[LEFT_PAD[0] + 66, LEFT_PAD[1] - 56]}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnMenuImg}
  position={[RIGHT_PAD[0] - 66, RIGHT_PAD[1] - 56]}
/>

<!-- Stick control -->
<ControllerStick
  layer={AppLayer.CONTROLLER + 1}
  code={ButtonCode.ANALOG_LEFT}
  sprite={btnStickImg}
  position={[LEFT_PAD[0] + 79, LEFT_PAD[1] + 72]}
/>
<ControllerStick
  layer={AppLayer.CONTROLLER + 1}
  code={ButtonCode.ANALOG_RIGHT}
  sprite={btnStickImg}
  position={[RIGHT_PAD[0] - 77, RIGHT_PAD[1] + 70]}
/>

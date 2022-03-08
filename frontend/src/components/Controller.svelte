<script lang="ts">
  import { onMount } from 'svelte'
  import WebFont from 'webfontloader'
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

  let loadingIcon = new PIXI.Text('{}', {
    fontFamily: 'Pokemon',
    fontSize: 28,
    fill: 0xffffff,
  })
  let loadingText = new PIXI.Text('Loading', {
    fontFamily: 'Pokemon',
    fontSize: 20,
    fill: 0xffffff,
  })

  onMount(() => {
    const controller = PIXI.Sprite.from(controllerImg)
    controller.position.set(AppSize.WIDTH / 2, AppSize.HEIGHT)
    controller.anchor.set(0.5, 0.25)
    controller.scale.set(0.5)
    controller.zIndex = AppLayer.CONTROLLER
    $appCtx.stage.addChild(controller)

    WebFont.load({
      custom: {
        families: ['Pokemon'],
      },
      active: () => {
        loadingIcon.zIndex = AppLayer.CONTROLLER + 1
        loadingIcon.anchor.set(0.5)
        loadingIcon.position.set(AppSize.WIDTH / 2, AppSize.HEIGHT - 30)
        $appCtx.stage.addChild(loadingIcon)

        loadingText.zIndex = AppLayer.CONTROLLER + 1
        loadingText.anchor.set(0.5)
        loadingText.position.set(AppSize.WIDTH / 2, AppSize.HEIGHT)
        $appCtx.stage.addChild(loadingText)
      },
    })

    $appCtx.ticker.add(handleLoadingIcon)
  })

  function handleButtonClick(code: ButtonCode) {
    $controllerCtx[code] = true
  }

  function handleLoadingIcon(dt: number) {
    if ($controllerCtx.isLoading) {
      loadingIcon.rotation += 0.1 * dt
      loadingIcon.alpha = 1
      loadingText.alpha = 1
    } else {
      loadingIcon.alpha = 0
      loadingText.alpha = 0
    }
  }
</script>

<!-- Right pad -->
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn1Img}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.TRIANGLE)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn2Img}
  position={[RIGHT_PAD[0] + BTN_PAD_GAP, RIGHT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.CIRCLE)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btn3Img}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] + BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.TIMES)}
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
  onClick={() => handleButtonClick(ButtonCode.ARROW_UP)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowRightImg}
  position={[LEFT_PAD[0] + BTN_PAD_GAP, LEFT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_RIGHT)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowDownImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] + BTN_PAD_GAP]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_DOWN)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={arrowLeftImg}
  position={[LEFT_PAD[0] - BTN_PAD_GAP, LEFT_PAD[1]]}
  onClick={() => handleButtonClick(ButtonCode.ARROW_LEFT)}
/>

<!-- Special button -->
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnTopLeftImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] - 80]}
  onClick={() => handleButtonClick(ButtonCode.TOP_LEFT)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnTopRightImg}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - 80]}
  onClick={() => handleButtonClick(ButtonCode.TOP_RIGHT)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnMenuImg}
  position={[LEFT_PAD[0] + 66, LEFT_PAD[1] - 56]}
  onClick={() => handleButtonClick(ButtonCode.MENU_LEFT)}
/>
<Button
  layer={AppLayer.CONTROLLER + 1}
  sprite={btnMenuImg}
  position={[RIGHT_PAD[0] - 66, RIGHT_PAD[1] - 56]}
  onClick={() => handleButtonClick(ButtonCode.MENU_RIGHT)}
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

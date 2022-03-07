<script lang="ts">
  import { onMount } from 'svelte'
  import * as PIXI from 'pixi.js'

  import { appCtx, AppSize } from 'core/context'
  import { ButtonCode } from 'core/buttonCode'
  import ControllerButton from 'components/ControllerButton.svelte'

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
  import ControllerStick from './ControllerStick.svelte'

  const RIGHT_PAD = [AppSize.WIDTH / 2 + 158, AppSize.HEIGHT + 12]
  const LEFT_PAD = [AppSize.WIDTH / 2 - 158, AppSize.HEIGHT + 12]
  const BTN_PAD_GAP = 32

  onMount(() => {
    const controller = PIXI.Sprite.from(controllerImg)
    controller.position.set(AppSize.WIDTH / 2, AppSize.HEIGHT)
    controller.anchor.set(0.5, 0.25)
    controller.scale.set(0.5)
    controller.zIndex = 1

    $appCtx.stage.addChild(controller)
  })
</script>

<!-- Right pad -->
<ControllerButton
  code={ButtonCode.TRIANGLE}
  sprite={btn1Img}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - BTN_PAD_GAP]}
/>
<ControllerButton
  code={ButtonCode.CIRCLE}
  sprite={btn2Img}
  position={[RIGHT_PAD[0] + BTN_PAD_GAP, RIGHT_PAD[1]]}
/>
<ControllerButton
  code={ButtonCode.TIMES}
  sprite={btn3Img}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] + BTN_PAD_GAP]}
/>
<ControllerButton
  code={ButtonCode.SQUARE}
  sprite={btn4Img}
  position={[RIGHT_PAD[0] - BTN_PAD_GAP, RIGHT_PAD[1]]}
/>

<!-- Left pad -->
<ControllerButton
  code={ButtonCode.ARROW_UP}
  sprite={arrowUpImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] - BTN_PAD_GAP]}
/>
<ControllerButton
  code={ButtonCode.ARROW_RIGHT}
  sprite={arrowRightImg}
  position={[LEFT_PAD[0] + BTN_PAD_GAP, LEFT_PAD[1]]}
/>
<ControllerButton
  code={ButtonCode.ARROW_DOWN}
  sprite={arrowDownImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] + BTN_PAD_GAP]}
/>
<ControllerButton
  code={ButtonCode.ARROW_LEFT}
  sprite={arrowLeftImg}
  position={[LEFT_PAD[0] - BTN_PAD_GAP, LEFT_PAD[1]]}
/>

<!-- Special button -->
<ControllerButton
  code={ButtonCode.TOP_LEFT}
  sprite={btnTopLeftImg}
  position={[LEFT_PAD[0], LEFT_PAD[1] - 80]}
/>
<ControllerButton
  code={ButtonCode.TOP_RIGHT}
  sprite={btnTopRightImg}
  position={[RIGHT_PAD[0], RIGHT_PAD[1] - 80]}
/>
<ControllerButton
  code={ButtonCode.MENU_LEFT}
  sprite={btnMenuImg}
  position={[LEFT_PAD[0] + 66, LEFT_PAD[1] - 56]}
/>
<ControllerButton
  code={ButtonCode.MENU_RIGHT}
  sprite={btnMenuImg}
  position={[RIGHT_PAD[0] - 66, RIGHT_PAD[1] - 56]}
/>

<!-- Stick control -->
<ControllerStick
  sprite={btnStickImg}
  position={[LEFT_PAD[0] + 79, LEFT_PAD[1] + 72]}
/>
<ControllerStick
  sprite={btnStickImg}
  position={[RIGHT_PAD[0] - 77, RIGHT_PAD[1] + 70]}
/>

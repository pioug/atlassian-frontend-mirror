import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Buttons are used as triggers for actions. They are used in forms, toolbars,
  dialog footers and as stand-alone action triggers.

  ## Variants

  ### Button (standard button)

  The most commonly used button component. This button has different appearances, as well as supported the existing dark mode solution.

  It does not support the discouraged theming approach.

  ${code`
    // from named entry point (to ensure minimum code is brought in)
    import Button from '@atlaskit/button/standard-button';

    // from main entry point
    import Button from '@atlaskit/button';
  `}

  ### Loading button

  A small wrapper around \`Button\` that allows you to show an \`@atlaskit/spinner\` as an overlay on the button when you set an isLoading prop to true.

  \`LoadingButton\` takes care of applying a spinner with the correct size and color based on the button spacing and appearance props.

  ${code`
    // from named entry point (to ensure minimum code is brought in)
    import LoadingButton from '@atlaskit/button/loading-button';

    // from main entry point
    import { LoadingButton } from '@atlaskit/button';
  `}

  ### Custom theme button

  Avoid using this component. It exists for those already using custom theming, which is hard to use and has performance issues.

  This theming approach will be improved in future.

  ${code`
    // from named entry point (to ensure minimum code is brought in)
    import CustomThemeButton from '@atlaskit/button/custom-theme-button';

    // from main entry point
    import { CustomThemeButton } from '@atlaskit/button';
  `}

  ## Behaviour

  Each button variation (\`Button\`, \`LoadingButton\` and \`CustomThemeButton\`) will render out a \`<button>\` element, an \`<a>\` element if a \`href\` prop is supplied, or render any other element type by using the component prop (for example, \`component="span"\`). Each button element looks and behaves similarly, regardless of element tag, as it is guided by the native \`<button>\` behavior. 

   A \`role\` prop is inferred from the element type or you can pass in a role prop if you need to.

  ## Focus behavior

  \`tabIndex={0}\` is added by default so the button element can get browser focus regardless of the element type used.

  On a \`mousedown\`, \`event.preventDefault()\` is always called to prevent the button from getting focus. This is questionable behaviour that we hope to change in future.

  When a native \`<button>\` is disabled, it loses browser focus and cannot be focused. We replicate this behavior by setting \`tabIndex={-1}\` on the button element and calling \`element.blur()\` when a button becomes disabled (\`isDisabled\` prop is set to true).

  ## Disabled buttons

  A disabled \`<button>\` is a native HTML concept, but disabled is not a native concept for other element types such as \`<a>\` and \`<span>\`.

  The behavior of a disabled \`<button>\` is imitated as much as possible regardless of element type.

  A disabled \`<button>\` will not fire any user events. We imitate this by:

  - Applying \`pointer-events: none\` to all children elements of the button element. This prevents inner elements publishing events.
  - Calling \`event.preventDefault()\` and \`event.stopPropagation()\` in the [capture phase](https://javascript.info/bubbling-and-capturing) for the following events: \`'mousedown'\`,\`'mouseup'\`, \`'keydown'\`, \`'keyup'\`, \`'touchstart'\`, \`'touchend'\`, \`'pointerdown'\`, \`'pointerup'\`, and \`'click\`'. This prevents the event performing its default browser behavior and stops the event from proceeding to the bubble phase.
  - Not calling provided bubble and capture event listeners.

  For a disabled button we also set \`tabIndex={-1}\`, and if the element has focus, we call \`element.blur()\`.

  ${(
    <Example
      title="Disabled behaviour"
      packageName="@atlaskit/button"
      Component={require('../examples/25-disabled').default}
      source={require('!!raw-loader!../examples/25-disabled')}
    />
  )}

  ## Buttons with an overlay

  Buttons support an overlay element, which is used to display a spinner for \`LoadingButton > isLoading\`. When there is an overlay the normal button content fades out and the button is non-interactive but not disabled.

  A \`button\` with an overlay:

  - will block events as if it is disabled
  - won’t lose focus automatically when the overlay is shown (unlike when it is disabled, where the focus is lost)
  - allows focus to be given and removed from the element

  The button will not show \`:active\` and \`:hover\` styles and otherwise keeps the same visual and cursor experience as if it did not have an overlay.

  ${(
    <Example
      title="Overlay behaviour"
      packageName="@atlaskit/button"
      Component={require('../examples/26-overlay').default}
      source={require('!!raw-loader!../examples/26-overlay')}
    />
  )}

  ## Adding event listeners

  For the most consistent behavior across elements, it’s safest to use bubble phase listeners on the button element and parent elements, for example, use \`onClick\` rather than \`onClickCapture\`. Although, event listeners *can* be added in either the capture or bubble phase on the button element. 

  Bubble and capture event listeners will not be called when the button component is disabled.

  For elements that are parents of a button you need to bind on the bubble phase (for example, \`onClick\`) since button does not abort the event until the capture phase. So as the event goes down the DOM tree in the capture phase, it’s not aborted until it reaches the button element. This means you will get a click event from a button on parents in the capture phase. A workaround is to add events to the window when disabled and stop the event a bit earlier, but that's a bit heavy.

  ${(
    <Props
      heading="Shared props (used by all variants)"
      props={require('!!extract-react-types-loader!../extract-react-types/shared-props.tsx')}
    />
  )}

  Button will also support any valid HTMLAttribute except for disabled. We control that value through isDisabled

  ${code`
    <React.AllHTMLAttributes<HTMLElement>, 'disabled'>
  `}

  ${(
    <Props
      heading="Loading button props"
      props={require('!!extract-react-types-loader!../extract-react-types/loading-button-props.tsx')}
    />
  )}

  ${(
    <Props
      heading="Custom theme button props"
      props={require('!!extract-react-types-loader!../extract-react-types/custom-theme-button-props.tsx')}
    />
  )}
`;

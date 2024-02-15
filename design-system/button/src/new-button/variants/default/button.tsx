import React from 'react';

import UNSAFE_PRESSABLE from '@atlaskit/primitives/pressable';

import { type CommonButtonVariantProps } from '../types';

import { type CommonDefaultButtonProps } from './types';
import useDefaultButton from './use-default-button';

export type ButtonProps = CommonDefaultButtonProps & CommonButtonVariantProps;

/**
 * __Button__
 *
 * A button triggers an event or action.
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const Button = React.memo(
  React.forwardRef(function Button(
    {
      analyticsContext,
      autoFocus,
      appearance,
      spacing,
      isDisabled,
      isSelected,
      iconBefore,
      UNSAFE_iconAfter_size,
      iconAfter,
      UNSAFE_iconBefore_size,
      children,
      shouldFitContainer,
      interactionName,
      overlay,
      onClick,
      onMouseDownCapture,
      onMouseUpCapture,
      onKeyDownCapture,
      onKeyUpCapture,
      onTouchStartCapture,
      onTouchEndCapture,
      onPointerDownCapture,
      onPointerUpCapture,
      onClickCapture,
      type = 'button',
      testId,
      ...rest
    }: ButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    const baseProps = useDefaultButton<HTMLButtonElement>({
      analyticsContext,
      appearance,
      autoFocus,
      buttonType: 'button',
      children,
      iconBefore,
      UNSAFE_iconBefore_size,
      iconAfter,
      UNSAFE_iconAfter_size,
      interactionName,
      isDisabled,
      isSelected,
      onClick,
      onMouseDownCapture,
      onMouseUpCapture,
      onKeyDownCapture,
      onKeyUpCapture,
      onTouchStartCapture,
      onTouchEndCapture,
      onPointerDownCapture,
      onPointerUpCapture,
      onClickCapture,
      overlay,
      ref,
      shouldFitContainer,
      spacing,
    });

    return (
      <UNSAFE_PRESSABLE
        // TODO: Remove spread props
        {...rest}
        ref={baseProps.ref}
        xcss={baseProps.xcss}
        isDisabled={baseProps.isDisabled}
        onClick={baseProps.onClick}
        onMouseDownCapture={baseProps.onMouseDownCapture}
        onMouseUpCapture={baseProps.onMouseUpCapture}
        onKeyDownCapture={baseProps.onKeyDownCapture}
        onKeyUpCapture={baseProps.onKeyUpCapture}
        onTouchStartCapture={baseProps.onTouchStartCapture}
        onTouchEndCapture={baseProps.onTouchEndCapture}
        onPointerDownCapture={baseProps.onPointerDownCapture}
        onPointerUpCapture={baseProps.onPointerUpCapture}
        onClickCapture={baseProps.onClickCapture}
        type={type}
        testId={testId}
      >
        {baseProps.children}
      </UNSAFE_PRESSABLE>
    );
  }),
);

Button.displayName = 'Button';

export default Button;

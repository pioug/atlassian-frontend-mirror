import React from 'react';

import UNSAFE_PRESSABLE from '@atlaskit/primitives/pressable';

import {
  type AdditionalHTMLElementPropsExtender,
  type CombinedButtonProps,
} from '../types';

import { type CommonDefaultButtonProps } from './types';
import useDefaultButton from './use-default-button';

type Element = HTMLButtonElement;
type AdditionalHTMLElementProps = AdditionalHTMLElementPropsExtender<
  React.ButtonHTMLAttributes<Element>
>;

export type ButtonProps = CommonDefaultButtonProps &
  CombinedButtonProps<Element, AdditionalHTMLElementProps>;

/**
 * __Button__
 *
 * @warning __UNSAFE__ Button is not yet safe for production use.
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
      // Button base
      analyticsContext,
      autoFocus,
      appearance,
      spacing,
      isDisabled,
      isSelected,
      iconBefore,
      iconAfter,
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
    ref: React.Ref<Element>,
  ) {
    const baseProps = useDefaultButton<Element>({
      analyticsContext,
      appearance,
      autoFocus,
      buttonType: 'button',
      children,
      iconBefore,
      iconAfter,
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

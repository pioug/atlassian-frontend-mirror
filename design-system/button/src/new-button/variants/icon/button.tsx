import React from 'react';

import UNSAFE_PRESSABLE from '@atlaskit/primitives/pressable';

import { type CommonButtonVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';
import useIconButton from './use-icon-button';

export type IconButtonProps = CommonIconButtonProps & CommonButtonVariantProps;

/**
 * __Icon Button__
 *
 * TODO: Description
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const IconButton = React.memo(
  React.forwardRef(function Button(
    {
      analyticsContext,
      autoFocus,
      appearance,
      spacing,
      isDisabled,
      isSelected,
      icon,
      children,
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
    }: IconButtonProps,
    ref: React.Ref<HTMLButtonElement>,
  ) {
    /**
     * TODO: At some stage I'll look into re-using more logic across 'default' and 'icon'
     * buttons. It's currently duplicated and mostly the same.
     */
    const baseProps = useIconButton<HTMLButtonElement>({
      analyticsContext,
      appearance,
      autoFocus,
      buttonType: 'button',
      children,
      icon,
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
      spacing,
    });

    return (
      <UNSAFE_PRESSABLE
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

IconButton.displayName = 'IconButton';

export default IconButton;

import React from 'react';

import { Box } from '@atlaskit/primitives';

import {
  type AdditionalHTMLElementPropsExtender,
  type CombinedButtonProps,
} from '../types';

import { type CommonIconButtonProps } from './types';
import useIconButton from './use-icon-button';

type Element = HTMLAnchorElement;
type AdditionalHTMLElementProps = AdditionalHTMLElementPropsExtender<
  React.AnchorHTMLAttributes<Element>
>;

export type LinkIconButtonProps = CommonIconButtonProps &
  CombinedButtonProps<Element, AdditionalHTMLElementProps>;

/**
 * __Link Button__
 *
 * A link button renders a link in the style of a button.
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const LinkIconButton = React.memo(
  React.forwardRef(function LinkIconButton(
    {
      // Button base
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
      testId,
      href,
      ...rest
    }: LinkIconButtonProps,
    ref: React.Ref<Element>,
  ) {
    const baseProps = useIconButton<Element>({
      analyticsContext,
      appearance,
      autoFocus,
      buttonType: 'link',
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
      // TODO: Allow custom components for routing (with context)
      // https://product-fabric.atlassian.net/browse/DSP-12505
      <Box
        {...rest}
        ref={baseProps.ref}
        xcss={baseProps.xcss}
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
        as="a"
        testId={testId}
        /**
         * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
         * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
         */
        href={baseProps.isDisabled ? undefined : href}
        role={baseProps.isDisabled ? 'link' : undefined}
        aria-disabled={baseProps.isDisabled === true ? true : undefined}
      >
        {baseProps.children}
      </Box>
    );
  }),
);

LinkIconButton.displayName = 'LinkIconButton';

export default LinkIconButton;

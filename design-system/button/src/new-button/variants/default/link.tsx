import React from 'react';

import { Box } from '@atlaskit/primitives';

import {
  type AdditionalHTMLElementPropsExtender,
  type CombinedButtonProps,
} from '../types';

import { type CommonDefaultButtonProps } from './types';
import useDefaultButton from './use-default-button';

type Element = HTMLAnchorElement;
type AdditionalHTMLElementProps = AdditionalHTMLElementPropsExtender<
  React.AnchorHTMLAttributes<Element>
>;

export type LinkButtonProps = CommonDefaultButtonProps &
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
const LinkButton = React.memo(
  React.forwardRef(function LinkButton(
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
      testId,
      href,
      ...rest
    }: LinkButtonProps,
    ref: React.Ref<Element>,
  ) {
    const baseProps = useDefaultButton<Element>({
      analyticsContext,
      appearance,
      autoFocus,
      buttonType: 'link',
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
      // TODO: Use Link primitive to allow custom components for routing (with context)
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

LinkButton.displayName = 'LinkButton';

export default LinkButton;

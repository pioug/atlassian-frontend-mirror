import React, { forwardRef, memo, type Ref } from 'react';

import UNSAFE_LINK from '@atlaskit/primitives/link';

import { type CommonLinkVariantProps } from '../types';

import { type CommonDefaultButtonProps } from './types';
import useDefaultButton from './use-default-button';

export type LinkButtonProps<
  RouterLinkConfig extends Record<string, any> = never,
> = CommonDefaultButtonProps & CommonLinkVariantProps<RouterLinkConfig>;

const LinkButtonBase = <RouterLinkConfig extends Record<string, any> = never>(
  {
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
  }: LinkButtonProps<RouterLinkConfig>,
  ref: Ref<HTMLAnchorElement>,
) => {
  const baseProps = useDefaultButton<HTMLAnchorElement>({
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
    <UNSAFE_LINK
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
      testId={testId}
      /**
       * Disable link in an accessible way using `href`, `role`, and `aria-disabled`.
       * @see https://a11y-guidelines.orange.com/en/articles/disable-elements/#disable-a-link
       */
      // @ts-expect-error (`href` is required, we could make it optional but don't want to encourage this pattern elsewhere)
      href={baseProps.isDisabled ? undefined : href}
      role={baseProps.isDisabled ? 'link' : undefined}
      aria-disabled={baseProps.isDisabled === true ? true : undefined}
    >
      {baseProps.children}
    </UNSAFE_LINK>
  );
};

// Workarounds to support generic types with forwardRef + memo
const WithRef = forwardRef(LinkButtonBase) as <
  RouterLinkConfig extends Record<string, any> = never,
>(
  props: LinkButtonProps<RouterLinkConfig> & { ref?: Ref<HTMLAnchorElement> },
) => ReturnType<typeof LinkButtonBase>;

/**
 * __Link Button__
 *
 * Renders a link in the style of a button.
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const LinkButton = memo(WithRef) as typeof WithRef;

export default LinkButton;

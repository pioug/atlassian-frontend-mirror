import React, { forwardRef, memo, type Ref } from 'react';

import UNSAFE_ANCHOR from '@atlaskit/primitives/anchor';

import { type CommonLinkVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';
import useIconButton from './use-icon-button';

export type LinkIconButtonProps<
  RouterLinkConfig extends Record<string, any> = never,
> = CommonIconButtonProps & CommonLinkVariantProps<RouterLinkConfig>;

const LinkIconButtonBase = <
  RouterLinkConfig extends Record<string, any> = never,
>(
  {
    analyticsContext,
    interactionName,
    autoFocus,
    appearance,
    spacing,
    isDisabled,
    isSelected,
    icon,
    label,
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
    shape,
    testId,
    UNSAFE_size,
    href,
    // Prevent duplicate labels being added.
    'aria-label': preventedAriaLabel,
    ...rest
  }: LinkIconButtonProps<RouterLinkConfig>,
  ref: Ref<HTMLAnchorElement>,
) => {
  const baseProps = useIconButton<HTMLAnchorElement>({
    analyticsContext,
    appearance,
    autoFocus,
    buttonType: 'link',
    icon,
    interactionName,
    isDisabled,
    isSelected,
    label,
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
    shape,
    spacing,
    UNSAFE_size,
  });

  return (
    <UNSAFE_ANCHOR
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
      componentName="LinkIconButton"
      analyticsContext={analyticsContext}
      interactionName={interactionName}
    >
      {baseProps.children}
    </UNSAFE_ANCHOR>
  );
};

// Workarounds to support generic types with forwardRef + memo
const WithRef = forwardRef(LinkIconButtonBase) as <
  RouterLinkConfig extends Record<string, any> = never,
>(
  props: LinkIconButtonProps<RouterLinkConfig> & {
    ref?: Ref<HTMLAnchorElement>;
  },
) => ReturnType<typeof LinkIconButtonBase>;

/**
 * __Link Icon Button__
 *
 * Renders a link in the style of an icon button.
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const LinkIconButton = memo(WithRef) as typeof WithRef;

export default LinkIconButton;

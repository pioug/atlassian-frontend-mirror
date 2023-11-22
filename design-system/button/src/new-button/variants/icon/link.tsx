import React, { forwardRef, memo, type Ref } from 'react';

import UNSAFE_LINK from '@atlaskit/primitives/link';

import { type CommonLinkVariantProps } from '../types';

import { type CommonIconButtonProps } from './types';
import useIconButton from './use-icon-button';

export type LinkIconButtonProps<
  RouterLinkConfig extends Record<string, any> = never,
> = CommonIconButtonProps &
  Omit<CommonLinkVariantProps<RouterLinkConfig>, 'children' | 'appearance'>;

const LinkIconButtonBase = <
  RouterLinkConfig extends Record<string, any> = never,
>(
  {
    analyticsContext,
    autoFocus,
    appearance,
    spacing,
    isDisabled,
    isSelected,
    icon,
    interactionName,
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
    testId,
    href,
    ...rest
  }: LinkIconButtonProps<RouterLinkConfig>,
  ref: Ref<HTMLAnchorElement>,
) => {
  const baseProps = useIconButton<HTMLAnchorElement>({
    analyticsContext,
    appearance,
    autoFocus,
    buttonType: 'link',
    children: null, // Set in hook.
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
 * @private __UNSAFE__ LinkIconButton is not yet safe for production use.
 *
 * Renders a link in the style of an icon button.
 *
 * - [Examples](https://atlassian.design/components/button/examples)
 * - [Code](https://atlassian.design/components/button/code)
 * - [Usage](https://atlassian.design/components/button/usage)
 */
const LinkIconButton = memo(WithRef) as typeof WithRef;

export default LinkIconButton;

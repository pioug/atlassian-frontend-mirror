import React, { Fragment, useMemo, useRef } from 'react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
import { Box, xcss } from '@atlaskit/primitives';

import { useSplitButtonContext } from '../../containers/split-button/split-button-context';
import {
  type Appearance,
  type CommonButtonProps,
  type Spacing,
} from '../types';

import blockEvents from './block-events';
import { getXCSS } from './xcss';

export type ControlledEvents<TagName extends HTMLElement> = Pick<
  React.DOMAttributes<TagName>,
  | 'onMouseDownCapture'
  | 'onMouseUpCapture'
  | 'onKeyDownCapture'
  | 'onKeyUpCapture'
  | 'onTouchStartCapture'
  | 'onTouchEndCapture'
  | 'onPointerDownCapture'
  | 'onPointerUpCapture'
  | 'onClickCapture'
> &
  Pick<CommonButtonProps<TagName>, 'onClick'>;

export type UseButtonBaseArgs<TagName extends HTMLElement> = {
  ref: React.Ref<TagName>;
  /**
   * The type of button. Used to pass action subject context to analytics.
   */
  buttonType: 'button' | 'link';
  isIconButton?: boolean;
  isCircle?: boolean;
  hasIconBefore?: boolean;
  hasIconAfter?: boolean;
  shouldFitContainer?: boolean;
  appearance?: Appearance;
  children: React.ReactNode;
  spacing?: Spacing;
  isLoading?: boolean;
} & Pick<
  CommonButtonProps<TagName>,
  | 'analyticsContext'
  | 'autoFocus'
  | 'interactionName'
  | 'isDisabled'
  | 'isSelected'
  | 'overlay'
> &
  ControlledEvents<TagName>;

export type UseButtonBaseReturn<TagName extends HTMLElement> = {
  xcss: ReturnType<typeof xcss>;
  ref(node: TagName | null): void;
  children: React.ReactNode;
  isDisabled: boolean;
} & ControlledEvents<TagName>;

const overlayStyles = xcss({
  position: 'absolute',
  insetInlineStart: 'space.0',
  insetBlockStart: 'space.0',
  insetInlineEnd: 'space.0',
  insetBlockEnd: 'space.0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/**
 * __Use button base__
 *
 * A React hook that accepts a set of common Button props,
 * and processes them to return consistent base props for usage
 * across various Button components.
 *
 * It also:
 * - Implements auto focus when enabled.
 * - Appends the `onClick` event with UFO analytics tracking.
 *
 * @private
 */
const useButtonBase = <TagName extends HTMLElement>({
  appearance: propAppearance = 'default',
  autoFocus = false,
  buttonType,
  isDisabled: propIsDisabled = false,
  isLoading = false,
  isSelected = false,
  // TODO: Separate Icon Button styling from button base
  isIconButton = false,
  isCircle = false,
  // TODO: Separate icon slot styling from button base
  hasIconBefore = false,
  hasIconAfter = false,
  children,
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
  shouldFitContainer = false,
  spacing: propSpacing = 'default',
}: UseButtonBaseArgs<TagName>): UseButtonBaseReturn<TagName> => {
  const localRef = useRef<TagName | null>(null);
  const splitButtonContext = useSplitButtonContext();

  const isSplitButton = Boolean(splitButtonContext);
  const isNavigationSplitButton =
    splitButtonContext?.isNavigationSplitButton || false;

  const appearance = splitButtonContext?.appearance || propAppearance;
  const spacing = splitButtonContext?.spacing || propSpacing;
  const isDisabled = splitButtonContext?.isDisabled || propIsDisabled;
  const isHighlighted = splitButtonContext?.isHighlighted || false;
  const isActiveOverSelected =
    splitButtonContext?.isActiveOverSelected || false;

  useAutoFocus(localRef, autoFocus);

  const buttonXCSS: ReturnType<typeof xcss> = useMemo(
    () =>
      getXCSS({
        appearance,
        spacing,
        isDisabled,
        isLoading,
        isSelected,
        isHighlighted,
        isActiveOverSelected,
        shouldFitContainer,
        isIconButton,
        isCircle,
        hasOverlay: Boolean(overlay),
        isLink: buttonType === 'link',
        hasIconBefore,
        hasIconAfter,
        isSplit: isSplitButton,
        isNavigationSplit: isNavigationSplitButton,
      }),
    [
      appearance,
      buttonType,
      spacing,
      isDisabled,
      isLoading,
      isSelected,
      isHighlighted,
      isActiveOverSelected,
      isIconButton,
      isCircle,
      shouldFitContainer,
      overlay,
      hasIconBefore,
      hasIconAfter,
      isSplitButton,
      isNavigationSplitButton,
    ],
  );

  const isEffectivelyDisabled = isDisabled || Boolean(overlay);

  return {
    ref: mergeRefs([localRef, ref]),
    xcss: buttonXCSS,
    // Consider overlay buttons to be effectively disabled
    isDisabled: isEffectivelyDisabled,
    children: (
      <Fragment>
        {children}
        {overlay ? (
          <Box as="span" xcss={overlayStyles}>
            {overlay}
          </Box>
        ) : null}
      </Fragment>
    ),
    ...blockEvents(isEffectivelyDisabled, {
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
    }),
  };
};

export default useButtonBase;

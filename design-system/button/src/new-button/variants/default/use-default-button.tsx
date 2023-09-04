import React, { Fragment } from 'react';

import { Box } from '@atlaskit/primitives';

import useButtonBase, {
  type UseButtonBaseArgs,
  type UseButtonBaseReturn,
} from '../shared/use-button-base';
import { contentStyles, getFadingStyles, iconStyles } from '../shared/xcss';

import { type CommonDefaultButtonProps } from './types';

type UseDefaultButtonArgs<TagName extends HTMLElement> =
  UseButtonBaseArgs<TagName> & CommonDefaultButtonProps;

type UseButtonReturn<TagName extends HTMLElement> =
  UseButtonBaseReturn<TagName>;

/**
 * __Use default button base__
 *
 * A React hook that accepts a set of default Button props,
 * and processes them to return consistent base props for usage
 * across Button and LinkButton variants.
 *
 * @private
 */
const useDefaultButton = <TagName extends HTMLElement>({
  analyticsContext,
  appearance,
  autoFocus,
  buttonType,
  iconBefore,
  iconAfter,
  interactionName,
  isDisabled,
  isSelected,
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
  shouldFitContainer,
  spacing,
}: UseDefaultButtonArgs<TagName>): UseButtonReturn<TagName> => {
  const fadeStyles = getFadingStyles({ hasOverlay: Boolean(overlay) });

  const baseProps = useButtonBase<TagName>({
    analyticsContext,
    appearance,
    autoFocus,
    buttonType,
    children: (
      <Fragment>
        {iconBefore && (
          <Box as="span" xcss={[fadeStyles, iconStyles]}>
            {iconBefore}
          </Box>
        )}
        {children && (
          <Box as="span" xcss={[fadeStyles, contentStyles]}>
            {children}
          </Box>
        )}
        {iconAfter && (
          <Box as="span" xcss={[fadeStyles, iconStyles]}>
            {iconAfter}
          </Box>
        )}
      </Fragment>
    ),
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
    hasIconBefore: Boolean(iconBefore),
    hasIconAfter: Boolean(iconAfter),
  });

  return baseProps;
};

export default useDefaultButton;

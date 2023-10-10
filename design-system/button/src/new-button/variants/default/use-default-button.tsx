import React, { Fragment } from 'react';

import Content from '../shared/content';
import useButtonBase, {
  type UseButtonBaseArgs,
  type UseButtonBaseReturn,
} from '../shared/use-button-base';

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
  const hasOverlay = Boolean(overlay);

  const baseProps = useButtonBase<TagName>({
    analyticsContext,
    appearance,
    autoFocus,
    buttonType,
    children: (
      <Fragment>
        {iconBefore && (
          <Content type="icon" hasOverlay={hasOverlay}>
            {iconBefore}
          </Content>
        )}
        {children && <Content hasOverlay={hasOverlay}>{children}</Content>}
        {iconAfter && (
          <Content type="icon" hasOverlay={hasOverlay}>
            {iconAfter}
          </Content>
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

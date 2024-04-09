import React, { Fragment } from 'react';

import Content from '../shared/content';
import renderLoadingOverlay from '../shared/loading-overlay';
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
  iconBefore: IconBefore,
  UNSAFE_iconBefore_size,
  iconAfter: IconAfter,
  UNSAFE_iconAfter_size,
  interactionName,
  isDisabled,
  isSelected,
  isLoading = false,
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
  const hasOverlay = Boolean(overlay || isLoading);

  const baseProps = useButtonBase<TagName>({
    analyticsContext,
    appearance,
    autoFocus,
    buttonType,
    children: (
      <Fragment>
        {IconBefore && (
          <Content type="icon" hasOverlay={hasOverlay}>
            <IconBefore label="" size={UNSAFE_iconBefore_size} />
          </Content>
        )}
        {children && <Content hasOverlay={hasOverlay}>{children}</Content>}
        {IconAfter && (
          <Content type="icon" hasOverlay={hasOverlay}>
            <IconAfter label="" size={UNSAFE_iconAfter_size} />
          </Content>
        )}
      </Fragment>
    ),
    interactionName,
    isDisabled,
    isLoading,
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
    overlay: isLoading
      ? renderLoadingOverlay({
          spacing,
          appearance,
          isDisabled,
          isSelected,
        })
      : overlay,
    ref,
    shouldFitContainer,
    spacing,
    hasIconBefore: Boolean(IconBefore),
    hasIconAfter: Boolean(IconAfter),
  });

  return baseProps;
};

export default useDefaultButton;

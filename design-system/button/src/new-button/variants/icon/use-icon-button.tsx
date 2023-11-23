import React from 'react';

import VisuallyHidden from '@atlaskit/visually-hidden';

import Content from '../shared/content';
import useButtonBase, {
  type UseButtonBaseArgs,
  type UseButtonBaseReturn,
} from '../shared/use-button-base';

import { type CommonIconButtonProps } from './types';

type UseIconButtonArgs<TagName extends HTMLElement> =
  UseButtonBaseArgs<TagName> & CommonIconButtonProps;

type UseIconButtonReturn<TagName extends HTMLElement> =
  UseButtonBaseReturn<TagName>;

/**
 * __Use icon button__
 *
 * A React hook that accepts a set of icon Button props,
 * and processes them to return consistent base props for usage
 * across IconButton and LinkIconButton variants.
 *
 * @private
 */
const useIconButton = <TagName extends HTMLElement>({
  analyticsContext,
  appearance,
  autoFocus,
  buttonType,
  icon: Icon,
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
  shouldFitContainer,
  spacing,
  UNSAFE_size,
}: UseIconButtonArgs<TagName>): UseIconButtonReturn<TagName> => {
  const hasOverlay = Boolean(overlay);

  const baseProps = useButtonBase<TagName>({
    analyticsContext,
    appearance,
    autoFocus,
    buttonType,
    children: (
      <Content type="icon" hasOverlay={hasOverlay}>
        <Icon label="" size={UNSAFE_size} />
        <VisuallyHidden>{label}</VisuallyHidden>
      </Content>
    ),
    interactionName,
    isDisabled,
    isSelected,
    isIconButton: true,
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

  return baseProps;
};

export default useIconButton;

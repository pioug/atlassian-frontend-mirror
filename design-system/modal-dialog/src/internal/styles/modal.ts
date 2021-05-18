import { css } from '@emotion/core';

import { prefersReducedMotion } from '@atlaskit/motion/accessibility';
import { easeInOut } from '@atlaskit/motion/curves';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import { N0, N30A, N60A, text } from '@atlaskit/theme/colors';
import { borderRadius, layers } from '@atlaskit/theme/constants';

import { gutter, verticalOffset, WIDTH_ENUM, WidthNames } from '../constants';
import { ModalDialogProps } from '../types';

const maxWidthDimensions = `calc(100vw - ${gutter * 2}px)`;
const maxHeightDimensions = `calc(100vh - ${gutter * 2 - 1}px)`;

export const dialogWidth = (width?: ModalDialogProps['width']) => {
  if (!width) {
    return 'auto';
  }

  const isWidthName = WIDTH_ENUM.values.indexOf(width.toString()) !== -1;
  const widthName = isWidthName && (width as WidthNames);

  if (widthName) {
    return `${WIDTH_ENUM.widths[widthName]}px`;
  }

  return typeof width === 'number' ? `${width}px` : width;
};

export const dialogHeight = (height?: ModalDialogProps['height']) => {
  if (!height) {
    return 'auto';
  }

  return typeof height === 'number' ? `${height}px` : height;
};

export const getFillScreenStyles = (scrollDistance: number) => css`
  height: 100vh;
  width: 100vw;

  // This instead of fixed so PopupSelect's
  // children are properly positioned.
  position: absolute;
  top: ${scrollDistance}px;

  z-index: ${layers.modal()};
  overflow-y: auto; // Enables scroll outside.
  -webkit-overflow-scrolling: touch;
`;

const modalStackTransition = (stackIndex: number) => css`
  // We only want to apply transform on modals shifting to the back of the stack.
  transform: ${stackIndex > 0
    ? `translateY(${stackIndex * (verticalOffset / 2)}px)`
    : 'none'};
  transition-property: transform;
  transition-duration: ${mediumDurationMs}ms;
  transition-timing-function: ${easeInOut};
  ${prefersReducedMotion()};
`;

const positionerBaseStyles = css`
  top: ${gutter}px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;

  max-width: ${maxWidthDimensions};
  max-height: ${maxHeightDimensions};

  pointer-events: none;
  width: max-content;
`;

const positionerResponsiveBaseStyles = css`
  position: fixed;
  left: 0;
  top: 0;

  height: 100%;
  width: 100%;
  max-width: 100%;

  z-index: ${layers.modal()};
`;

export const getPositionRelativeStyles = (stackIndex: number) => css`
  ${positionerResponsiveBaseStyles};
  ${modalStackTransition(stackIndex)};

  margin: 0;

  @media (min-width: 480px) {
    position: relative;
    margin: ${gutter}px auto;
    width: max-content;
  }
`;

export const getPositionAbsoluteStyles = (stackIndex: number) => css`
  ${positionerResponsiveBaseStyles};
  ${modalStackTransition(stackIndex)};

  @media (min-width: 480px) {
    ${positionerBaseStyles};
    position: absolute;
  }
`;

export const getPositionFixedStyles = (stackIndex: number) => css`
  ${positionerResponsiveBaseStyles};
  ${modalStackTransition(stackIndex)};

  @media (min-width: 480px) {
    ${positionerBaseStyles};
    position: fixed;
  }
`;

type DialogStyles = Pick<ModalDialogProps, 'isChromeless' | 'height' | 'width'>;
export const getDialogStyles = ({
  isChromeless,
  height,
  width,
}: DialogStyles) => css`
  color: ${text()};
  display: flex;
  flex-direction: column;

  pointer-events: auto;

  height: 100%;
  width: 100%;
  max-height: 100vh;
  max-width: 100vw;

  ${isChromeless !== true &&
  css`
    background-color: ${N0};
  `}

  @media (min-width: 480px) {
    height: ${dialogHeight(height)};
    width: ${dialogWidth(width)};
    max-height: inherit;
    max-width: inherit;

    ${isChromeless !== true &&
    css`
      border-radius: ${borderRadius()}px;
      box-shadow: 0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A};
    `}
  }
`;

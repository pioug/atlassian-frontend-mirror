import { css } from '@emotion/core';

import { prefersReducedMotion } from '@atlaskit/motion/accessibility';
import { easeInOut } from '@atlaskit/motion/curves';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import { DN50, N0, N30A, N60A, text } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, layers } from '@atlaskit/theme/constants';

import { PositionerProps } from '../components/positioner';
import { gutter, verticalOffset, WIDTH_ENUM, WidthNames } from '../constants';
import { ModalDialogProps } from '../types';

const maxDimensions = `calc(100% - ${gutter * 2}px)`;
const maxHeightDimensions = `calc(100% - ${gutter * 2 - 1}px)`;

interface DialogWidth {
  widthName?: WidthNames;
  widthValue?: string | number;
}

export const dialogWidth = ({ widthName, widthValue }: DialogWidth) => {
  if (typeof widthValue === 'number') {
    return `${widthValue}px`;
  }

  return widthName ? `${WIDTH_ENUM.widths[widthName]}px` : widthValue || 'auto';
};

interface DialogHeight {
  heightValue?: string | number;
}

export const dialogHeight = ({ heightValue }: DialogHeight) => {
  if (typeof heightValue === 'number') {
    return `${heightValue}px`;
  }
  return heightValue || 'auto';
};

/**
  NOTE:
  z-index
  - temporarily added to beat @atlaskit/navigation

  absolute + top
  - rather than fixed position so popper.js children are properly positioned

  overflow-y
  - only active when popper.js children invoked below the dialog
*/
export const getFillScreenStyles = (scrollDistance: number) => css`
  height: 100vh;
  left: 0;
  overflow-y: auto;
  position: absolute;
  top: ${scrollDistance}px;
  width: 100%;
  z-index: ${layers.modal()};
  -webkit-overflow-scrolling: touch;
`;

type PositionerStyles = Omit<PositionerProps, 'scrollBehavior' | 'children'>;
const positionerBaseStyles = ({
  stackIndex,
  ...widthOptions
}: PositionerStyles) => css`
  display: flex;
  flex-direction: column;
  height: ${maxHeightDimensions};
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: ${maxDimensions};
  top: ${gutter}px;
  width: ${dialogWidth(widthOptions)};
  z-index: ${layers.modal()};
  pointer-events: none;

  // We only want to apply transform on modals shifting to the back of the stack.
  transform: ${stackIndex! > 0
    ? `translateY(${stackIndex! * (verticalOffset / 2)}px)`
    : 'none'};
  transition-property: transform;
  transition-duration: ${mediumDurationMs}ms;
  transition-timing-function: ${easeInOut};
  ${prefersReducedMotion()};
`;

const positionerResponsiveBaseStyles = css`
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  max-width: 100%;
  width: 100%;
`;

export const getPositionRelativeStyles = (props: PositionerStyles) => css`
  margin: ${gutter}px auto;
  position: relative;
  width: ${dialogWidth(props)};
  z-index: ${layers.modal()};

  @media (max-width: 480px) {
    ${positionerResponsiveBaseStyles};
    margin: 0;
  }
`;

export const getPositionAbsoluteStyles = (props: PositionerStyles) => css`
  ${positionerBaseStyles(props)};
  position: absolute;

  @media (max-width: 480px) {
    ${positionerResponsiveBaseStyles};
  }
`;

export const getPositionFixedStyles = (props: PositionerStyles) => css`
  ${positionerBaseStyles(props)};
  position: fixed;

  @media (max-width: 480px) {
    ${positionerResponsiveBaseStyles};
  }
`;

type DialogStyles = Pick<ModalDialogProps, 'isChromeless' | 'height'>;
export const getDialogStyles = ({ isChromeless, height }: DialogStyles) => css`
  color: ${text()};
  display: flex;
  flex-direction: column;
  height: ${dialogHeight({ heightValue: height })};
  max-height: 100%;
  outline: 0;
  pointer-events: auto;

  ${isChromeless !== true &&
  css`
    background-color: ${themed({ light: N0, dark: DN50 })()};
    border-radius: ${borderRadius()}px;
    box-shadow: 0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A};
  `}

  @media (max-width: 480px) {
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
`;

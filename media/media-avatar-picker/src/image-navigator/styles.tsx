import { token } from '@atlaskit/tokens';
import { css, keyframes } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';
import { checkeredBg } from './images';

import { AVATAR_DIALOG_WIDTH } from '../avatar-picker-dialog/layout-const';

export const imageBgStyles = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 256px;
  height: 256px;
  background: url('${checkeredBg}');
  border-radius: ${token('border.radius', '3px')};
`;

export const containerStyles = css`
  box-sizing: border-box;
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  position: relative;
`;

export const sliderContainerStyles = css`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin-top: ${token('space.100', '8px')};

  input {
    box-sizing: content-box;
    padding: 0;
  }
  background-color: ${token('elevation.surface.overlay', '#fff')};
`;

export const fileInputStyles = css`
  display: none;
`;

export const imageUploaderStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 ${token('space.150', '10px')} ${token('space.250', '20px')}
    ${token('space.150', '10px')};
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const droppingAnimation = css`
  border-color: ${token('color.border.information', '#0e56c4')};
  animation: ${spin} 8s linear infinite;
`;

export interface DragZoneProps {
  isDroppingFile: boolean;
  showBorder: boolean;
}

const getBorder = (showBorder: boolean) =>
  `${showBorder ? `2px dashed ${token('color.border', '#d0d6d0')}` : 'none'}`;

const getDroppingAnimation = (isDroppingFile: boolean) =>
  isDroppingFile
    ? css`
        background-color: ${token(
          'color.background.information.hovered',
          '#ddecfe',
        )};

        &:after {
          ${droppingAnimation}
        }
      `
    : '';

export const dragZoneStyles = (props: DragZoneProps) => css`
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${token('space.200', '15px')};
  position: relative;
  border-radius: 100%;
  transition: background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

  &::after {
    content: '';
    border: ${getBorder(props.showBorder)};
    border-radius: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: border-color 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  }

  ${getDroppingAnimation(props.isDroppingFile)};
`;

dragZoneStyles.displayName = 'DragZone';

export const dragZoneImageStyles = css`
  width: 100px;
`;

const getWidth = (isFullSize: boolean) =>
  `${
    isFullSize
      ? `width: calc(${AVATAR_DIALOG_WIDTH} - ${token(
          'space.100',
          '8px',
        )} * 8)px`
      : 'width:auto'
  }`;

export interface DragZoneTextProps {
  isFullSize: boolean;
}

export const dragZoneTextStyles = (props: DragZoneTextProps) => css`
  text-align: center;
  color: ${token('color.text.subtlest', N200)};
  ${getWidth(props.isFullSize)};
`;

export const selectionBlockerStyles = css`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  user-select: none;
`;

export const paddedBreakStyles = css`
  margin-top: ${token('space.100', '10px')} !important;
  margin-bottom: ${token('space.100', '10px')};
`;

export const sliderWrapperStyles = css`
  display: flex;
  align-items: center;
  width: 100%;

  .zoom_button svg {
    position: relative;
    left: ${token('space.negative.025', '-2px')};
  }
`;

import { token } from '@atlaskit/tokens';
import { css, keyframes } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';
import { checkeredBg } from './images';

import { AVATAR_DIALOG_WIDTH } from '../avatar-picker-dialog/layout-const';

export const imageBgStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '256px',
  height: '256px',
  background: `url('${checkeredBg}')`,
  borderRadius: token('border.radius', '3px'),
});

export const containerStyles = css({
  boxSizing: 'border-box',
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  position: 'relative',
});

export const sliderContainerStyles = css({
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'row',
  marginTop: token('space.100', '8px'),
  input: {
    boxSizing: 'content-box',
    padding: 0,
  },
  backgroundColor: token('elevation.surface.overlay', '#fff'),
});

export const fileInputStyles = css({
  display: 'none',
});

export const imageUploaderStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: `0 ${token('space.150', '10px')} ${token(
    'space.250',
    '20px',
  )} ${token('space.150', '10px')}`,
});

const spin = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
});

const droppingAnimation = css({
  borderColor: token('color.border.information', '#0e56c4'),
  animation: `${spin} 8s linear infinite`,
});

export interface DragZoneProps {
  isDroppingFile: boolean;
  showBorder: boolean;
}

const getBorder = (showBorder: boolean) =>
  `${showBorder ? `2px dashed ${token('color.border', '#d0d6d0')}` : 'none'}`;

const getDroppingAnimation = (isDroppingFile: boolean) =>
  isDroppingFile
    ? css({
        backgroundColor: token(
          'color.background.information.hovered',
          '#ddecfe',
        ),
        '&:after': droppingAnimation,
      })
    : '';

export const dragZoneStyles = (props: DragZoneProps) =>
  css(
    {
      width: '200px',
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: token('space.200', '15px'),
      position: 'relative',
      borderRadius: '100%',
      transition: 'background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
      '&::after': {
        content: "''",
        border: getBorder(props.showBorder),
        borderRadius: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'border-color 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
    getDroppingAnimation(props.isDroppingFile),
  );

dragZoneStyles.displayName = 'DragZone';

export const dragZoneImageStyles = css({
  width: '100px',
});

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

export const dragZoneTextStyles = (props: DragZoneTextProps) =>
  css(
    {
      textAlign: 'center',
      color: token('color.text.subtlest', N200),
    },
    getWidth(props.isFullSize),
  );

export const selectionBlockerStyles = css({
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
  userSelect: 'none',
});

export const paddedBreakStyles = css({
  marginTop: `${token('space.100', '10px')} !important`,
  marginBottom: token('space.100', '10px'),
  textAlign: 'center',
});

export const sliderWrapperStyles = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '.zoom_button svg': {
    position: 'relative',
    left: token('space.negative.025', '-2px'),
  },
});

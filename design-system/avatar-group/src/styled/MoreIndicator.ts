import styled from 'styled-components';

import {
  AppearanceType,
  AVATAR_RADIUS,
  AVATAR_SIZES,
  BORDER_WIDTH,
  SizeType,
} from '@atlaskit/avatar';
import {
  B200,
  background,
  DN400,
  DN70,
  N40,
  N500,
  N70A,
} from '@atlaskit/theme/colors';
import { themed, withTheme } from '@atlaskit/theme/components';

const EXCESS_INDICATOR_FONT_SIZE: Record<SizeType, number> = {
  xsmall: 10,
  small: 10,
  medium: 11,
  large: 12,
  xlarge: 16,
  xxlarge: 16,
};

export const Outer = withTheme(styled.button<any>`
  height: ${({ size }) => AVATAR_SIZES[size as SizeType]}px;
  width: ${({ size }) => AVATAR_SIZES[size as SizeType]}px;
  align-items: stretch;
  background-color: ${props => props.borderColor || background()};
  border: 0;
  border-radius: ${({ appearance, size }) =>
    appearance === 'circle'
      ? '50%'
      : `${AVATAR_RADIUS[size as SizeType] + BORDER_WIDTH}px`};
  padding: ${BORDER_WIDTH}px;
  box-sizing: content-box;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  outline: none;
  overflow: hidden;
  position: static;
  transform: translateZ(0);
  transition: background-color 0s ease-out;

  &::-moz-focus-inner {
    border: 0;
    margin: 0;
    padding: 0;
  }

  &::after {
    background-color: transparent;
    border-radius: ${({ appearance, size }) =>
      appearance === 'circle' ? '50%' : `${AVATAR_RADIUS[size as SizeType]}px`};
    bottom: ${BORDER_WIDTH}px;
    content: ' ';
    left: ${BORDER_WIDTH}px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    right: ${BORDER_WIDTH}px;
    top: ${BORDER_WIDTH}px;
    transition: opacity 200ms, background-color 200ms ease-out;
  }

  :active,
  :hover {
    &::after {
      background-color: ${N70A};
      opacity: 1;
    }
  }

  :focus {
    outline: none;
    background-color: ${B200};
  }

  :active {
    transform: scale(0.9);
  }
`);

interface InnerProps {
  size: SizeType;
  appearance: AppearanceType;
  isActive?: boolean;
  isFocus?: boolean;
  isHover?: boolean;
}

export const Inner = withTheme(styled.span<InnerProps>`
  background-color: ${themed({ light: N40, dark: DN70 })};
  border-radius: ${props =>
    props.appearance === 'circle' ? '50%' : `${AVATAR_RADIUS[props.size]}px`};
  align-items: center;
  box-shadow: 0 0 0
    ${props => (props.isFocus && !props.isActive ? `${BORDER_WIDTH}px` : 0)}
    ${B200};
  color: ${themed({ light: N500, dark: DN400 })};
  cursor: pointer;
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  font-size: ${props => EXCESS_INDICATOR_FONT_SIZE[props.size || 'medium']}px;
  justify-content: center;
  transition: box-shadow 200ms;
`);

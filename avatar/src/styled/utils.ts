import { css } from 'styled-components';
import { ThemedValue } from '@atlaskit/theme';
import { themed } from '@atlaskit/theme/components';
import { B200, N70A, N200A, DN80A, background } from '@atlaskit/theme/colors';
import {
  AVATAR_RADIUS,
  AVATAR_SIZES,
  BORDER_WIDTH,
  TRANSITION_DURATION,
} from './constants';
import { AvatarClickType, AppearanceType, SizeType } from '../types';

const backgroundColorFocus = B200;
const overlayColorDefault = 'transparent';
const overlayColorHover = N70A;
const overlayColorSelected = N200A;
const overlayColorDisabled = themed({
  light: 'rgba(255, 255, 255, 0.7)',
  dark: DN80A,
});

// "square" avatars are explicit
export function getBorderRadius(
  props: { appearance: AppearanceType; size: SizeType },
  config: { includeBorderWidth: boolean } = { includeBorderWidth: false },
) {
  const borderWidth: number = config.includeBorderWidth
    ? BORDER_WIDTH[props.size]
    : 0;
  return props.appearance === 'circle'
    ? '50%'
    : `${AVATAR_RADIUS[props.size] + borderWidth}px`;
}

export const getSize = ({ size }: { size: SizeType }) => AVATAR_SIZES[size]; // for testing
export function getAvatarDimensions(
  { size }: { size: SizeType },
  config: {
    includeBorderWidth: boolean;
    sizeOnly: boolean;
  } = {
    includeBorderWidth: false,
    sizeOnly: false,
  },
) {
  const borderWidth: number = config.includeBorderWidth
    ? BORDER_WIDTH[size] * 2
    : 0;

  const finalSize: number = AVATAR_SIZES[size] + borderWidth;

  return config.sizeOnly
    ? finalSize
    : `
    height: ${finalSize}px;
    width: ${finalSize}px;
  `;
}

interface InnerStylesProps {
  appearance?: AppearanceType;
  size?: SizeType;
  isInteractive?: boolean;
  href?: string;
  borderColor?: string | (() => string);
  stackIndex?: number;
  isActive?: boolean;
  isDisabled?: boolean;
  isFocus?: boolean;
  isHover?: boolean;
  isSelected?: boolean;
  onClick?: AvatarClickType;
}

// expose here for use with multiple element types
export function getInnerStyles(
  props: InnerStylesProps = { appearance: 'circle', size: 'medium' },
) {
  const boxSizing: string = 'content-box';
  const borderWidth: string = `${BORDER_WIDTH[props.size!]}px`;
  const isInteractive: boolean = Boolean(
    props.isInteractive || props.href || props.onClick,
  );
  // We make the distinction between isInteractive and isClickable as supplying a tooltip
  // makes the avatar interactive but not clickable
  const isClickable = Boolean(props.href || props.onClick);

  let backgroundColor = props.borderColor || background;
  // Inherit cursor styles so we don't cancel out pointer cursors in places like avatar group more dropdown
  let cursor = 'inherit';
  let outline = 'none';
  let overlayShade: string | ThemedValue<string> = overlayColorDefault;
  let overlayOpacity = 0;
  let pointerEvents = 'auto';
  let position = 'static';
  let transform = 'translateZ(0)';
  let transitionDuration = '0s';

  // Interaction: Hover
  if (isInteractive && (props.isActive || props.isHover)) {
    overlayShade = overlayColorHover;
    overlayOpacity = 1;
  }

  // Interaction: Active
  if (isClickable && props.isActive) {
    transform = 'scale(0.9)';
  }

  // Interaction: Focus
  if (isInteractive && props.isFocus && !props.isActive) {
    outline = 'none';
    backgroundColor = backgroundColorFocus;
    transitionDuration = TRANSITION_DURATION;
  }

  // Disabled
  if (props.isDisabled) {
    cursor = 'not-allowed';
    overlayShade = overlayColorDisabled;
    overlayOpacity = 1;
    pointerEvents = 'none';
  }

  // Clickable
  if (isClickable) {
    cursor = 'pointer';
  }

  // Loading
  if (props.isSelected) {
    overlayShade = overlayColorSelected;
    overlayOpacity = 1;
  }

  // Stack
  if (props.stackIndex) {
    position = 'relative';
  }

  return css`
    ${getAvatarDimensions};
    align-items: stretch;
    background-color: ${backgroundColor};
    border: 0;
    border-radius: ${p => getBorderRadius(p, { includeBorderWidth: true })};
    padding: ${borderWidth};
    box-sizing: ${boxSizing};
    cursor: ${cursor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: ${outline};
    overflow: hidden;
    pointer-events: ${pointerEvents};
    position: ${position};
    transform: ${transform};
    transition: background-color ${transitionDuration} ease-out;

    a &,
    button & {
      cursor: pointer;
    }

    &::after {
      background-color: ${overlayShade};
      border-radius: ${getBorderRadius};
      bottom: ${borderWidth};
      content: ' ';
      left: ${borderWidth};
      opacity: ${overlayOpacity};
      pointer-events: none;
      position: absolute;
      right: ${borderWidth};
      top: ${borderWidth};
      transition: opacity ${TRANSITION_DURATION};
    }

    &::-moz-focus-inner {
      border: 0;
      margin: 0;
      padding: 0;
    }
  `;
}

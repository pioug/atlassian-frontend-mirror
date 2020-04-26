import styled, { css } from 'styled-components';

import { ThemedValue } from '@atlaskit/theme';
import {
  B200,
  B75,
  background,
  backgroundActive,
  backgroundHover,
  DN300,
  DN600,
  N200,
  N900,
} from '@atlaskit/theme/colors';
import { themed, withTheme } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';

import { AvatarClickType } from '../types';
const focusBorderColor = themed({ light: B200, dark: B75 });
const textColors = themed({ light: N900, dark: DN600 });
const subtleTextColors = themed({ light: N200, dark: DN300 });

interface GetBackgroundColorType {
  backgroundColor?: string;
  href?: string;
  isActive?: boolean;
  isHover?: boolean;
  isSelected?: boolean;
  mode: 'dark' | 'light';
  onClick?: AvatarClickType;
}

export function getBackgroundColor({
  backgroundColor,
  href,
  isActive,
  isHover,
  isSelected,
  onClick,
}: GetBackgroundColorType) {
  const isInteractive = href || onClick;

  let themedBackgroundColor = backgroundColor || background;

  // Interaction: Hover
  if (isInteractive && (isHover || isSelected)) {
    themedBackgroundColor = backgroundHover;
  }

  // Interaction: Active
  if (isInteractive && isActive) {
    themedBackgroundColor = backgroundActive;
  }

  return themedBackgroundColor;
}

type getStylesType = {
  isInteractive?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
  isFocus?: boolean;
  mode: 'dark' | 'light';
};

export function getStyles({
  isInteractive,
  isActive,
  isDisabled,
  isFocus,
}: getStylesType) {
  let borderColor: string | ThemedValue<string> = 'transparent';
  let cursor = 'auto';
  let opacity = 1;
  let outline = 'none';
  let pointerEvents = 'auto';

  // Interaction: Focus
  if (isInteractive && isFocus && !isActive) {
    outline = 'none';
    borderColor = focusBorderColor;
  }

  // Disabled
  if (isDisabled) {
    cursor = 'not-allowed';
    opacity = 0.75;
    pointerEvents = 'none';
  }

  // Interactive
  if (isInteractive) {
    cursor = 'pointer';
  }

  return css`
    align-items: center;
    background-color: ${getBackgroundColor};
    border-radius: ${borderRadius}px;
    border: 2px solid ${borderColor};
    box-sizing: border-box;
    color: inherit;
    cursor: ${cursor};
    display: flex;
    font-size: inherit;
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    opacity: ${opacity};
    outline: ${outline};
    margin: 0;
    padding: ${gridSize() * 2}px;
    pointer-events: ${pointerEvents};
    text-align: left;
    text-decoration: none;
    width: 100%;
  `;
}

const truncateText = (p: { truncate: boolean }) =>
  p.truncate &&
  css`
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;

export const Content = styled.div<{
  truncate: boolean;
}>`
  ${truncate =>
    truncate &&
    css`
      max-width: 100%;
      min-width: 0;
    `}
  flex: 1 1 100%;
  line-height: 1.4;
  padding-left: ${gridSize}px;
`;

export const PrimaryText = withTheme(styled.div`
  ${truncateText} color: ${textColors};
`);

export const SecondaryText = withTheme(styled.div`
  ${truncateText} color: ${subtleTextColors};
  font-size: 0.85em;
`);

import { css } from '@emotion/react';
import { gridSize, borderRadius } from '@atlaskit/theme/constants';
import { N30, N100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import {
  akEditorMobileMaxWidth,
  relativeFontSizeToBase16,
} from '@atlaskit/editor-shared-styles';

const akGridSize = gridSize() + 'px';

export const buttonGroupStyle = css`
  display: inline-flex;
  align-items: center;

  & > div {
    display: flex;
  }
`;

export const separatorStyles = css`
  background: ${token('color.border', N30)};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

export const wrapperStyle = css`
  display: flex;
  align-items: center;

  > div,
  > span {
    display: flex;
  }

  > div > div {
    display: flex;
  }

  margin-left: 0;
  min-width: auto;
`;

export const wrapperSmallStyle = css`
  margin-left: 4px;
  min-width: 40px;
`;

export const expandIconWrapperStyle = css`
  margin-left: -8px;
`;

export const triggerWrapperStyles = css`
  display: flex;
`;

export const buttonContentStyle = css`
  display: flex;
  min-width: 80px;
  align-items: center;
  overflow: hidden;
  justify-content: center;
  flex-direction: column;
  padding: 6px;
`;

export const buttonContentReducedSpacingStyle = css`
  padding: 8px;
`;

// Taken from the style of inline dialog components
export const dropShadow = css`
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 0 1px rgba(9, 30, 66, 0.31),
    0 4px 8px -2px rgba(9, 30, 66, 0.25)`,
  )};
`;

// TODO: https://product-fabric.atlassian.net/browse/DSP-4494
export const scrollbarStyles = `
  -ms-overflow-style: -ms-autohiding-scrollbar;

  &::-webkit-scrollbar {
    height: ${akGridSize};
    width: ${akGridSize};
  }

  &::-webkit-scrollbar-corner {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${token(
      'color.background.neutral.subtle',
      'rgba(0, 0, 0, 0)',
    )};
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: ${token(
      'color.background.neutral.bold',
      'rgba(0, 0, 0, 0.2)',
    )};
    border-radius: ${akGridSize};
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${token(
      'color.background.neutral.bold.hovered',
      'rgba(0, 0, 0, 0.4)',
    )};
  }
`;

export const shortcutStyle = css`
  background-color: ${token(
    'color.background.neutral',
    'rgba(223, 225, 229, 0.5)',
  )}; /* N60 at 50% */
  color: ${token('color.text.subtle', N100)};
  border-radius: ${borderRadius()}px;
  padding: 4px;
  line-height: 12px;
  font-size: ${relativeFontSizeToBase16(11.67)};
  align-self: flex-end;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    display: none;
  }
`;

export const clickSelectWrapperStyle = css`
  user-select: all;
`;

export const cellColourPreviewStyles = (selectedColor: string) => css`
  &::before {
    background: ${selectedColor};
  }
`;

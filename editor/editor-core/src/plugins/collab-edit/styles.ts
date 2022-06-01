import { css } from '@emotion/react';
import { TELEPOINTER_DIM_CLASS } from './plugin-state';
import { colors, Color } from './utils';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const telepointerColorStyle = (color: Color, index: number) => `
  &.color-${index} {
    background-color: ${color.selection};
    &::after {
      background-color: ${color.solid};
      color: ${token('color.text.inverse', '#fff')};
      border-color: ${color.solid};
    }
  }
`;

export const telepointerStyle = css`
  .ProseMirror .telepointer {
    position: relative;
    transition: opacity 200ms;

    &.telepointer-selection {
      line-height: 1.2;
      pointer-events: none;
      user-select: none;
    }

    &.telepointer-selection-badge::after {
      content: attr(data-initial);
      position: absolute;
      display: block;
      top: -14px;
      font-size: ${relativeFontSizeToBase16(9)};
      padding: 2px;
      color: ${token('color.text.inverse', 'white')};
      left: -1px;
      border-radius: 2px 2px 2px 0;
      line-height: initial;
    }

    &.${TELEPOINTER_DIM_CLASS} {
      opacity: 0.2;
    }

    ${colors.map((color, index) => telepointerColorStyle(color, index))};
  }
`;

import styled, { css } from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { gridSize, borderRadius } from '@atlaskit/theme/constants';
import { R500, DN30, N700, R50, R100 } from '@atlaskit/theme/colors';
import { TagColor } from '../types';
import { buttonWidthUnitless, tagHeight, focusRingColor } from '../constants';
import {
  backgroundColor,
  backgroundColorHover,
  textColor,
  textColorHover,
} from '../theme';

interface SpanProps {
  isRemovable?: boolean;
  isRemoved?: boolean;
  isRemoving?: boolean;
  isRounded?: boolean;
  isFocused?: boolean;
  isLink: boolean;
  markedForRemoval: boolean;
  color: TagColor;
}

const colorRemoval = themed({ light: R500, dark: DN30 });
const colorRemovalHover = themed({ light: N700, dark: DN30 });
const backgroundColorRemoval = themed({ light: R50, dark: R100 });

export const Span = styled.span<SpanProps>`
  background-color: ${p =>
    p.markedForRemoval ? backgroundColorRemoval(p) : backgroundColor(p)};
  color: ${p => (p.markedForRemoval ? colorRemoval(p) : textColor(p))};
  border-radius: ${({ isRounded }) =>
    isRounded ? `${buttonWidthUnitless / 2}px` : `${borderRadius()}px`};
  cursor: default;
  display: flex;
  height: ${tagHeight};
  line-height: 1;
  margin: ${gridSize() / 2}px;
  padding: 0;
  overflow: ${({ isRemoved, isRemoving }) =>
    isRemoved || isRemoving ? 'hidden' : 'initial'};

  &:hover {
    ${p =>
      p.isLink &&
      css`
        background-color: ${p =>
          p.markedForRemoval
            ? backgroundColorRemoval(p)
            : backgroundColorHover(p)};
        color: ${p =>
          p.markedForRemoval ? colorRemovalHover(p) : textColorHover(p)};
      `}
  }

  ${p =>
    p.isFocused &&
    css`
      box-shadow: 0 0 0 2px ${focusRingColor(p)};
      outline: none;
    `}
`;

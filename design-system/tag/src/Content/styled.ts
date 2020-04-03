import styled, { css } from 'styled-components';
import { gridSize, fontSize } from '@atlaskit/theme/constants';
import { linkHover } from '@atlaskit/theme/colors';
import { divide } from '@atlaskit/theme/math';
import {
  buttonWidthUnitless,
  maxTextWidth,
  maxTextWidthUnitless,
} from '../constants';
import { Props as ContentProps } from './index';

// Common styles for Text & Link
const COMMON_STYLES = css`
  font-size: ${fontSize}px;
  font-weight: normal;
  line-height: 1;
  margin-left: ${divide(gridSize, 2)}px;
  margin-right: ${divide(gridSize, 2)}px;
  padding: 2px 0;
  max-width: ${({ isRemovable }) =>
    isRemovable
      ? `${maxTextWidthUnitless - buttonWidthUnitless}px`
      : maxTextWidth};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Text = styled.span`
  ${COMMON_STYLES};
`;

export const linkStyles = css`
  ${COMMON_STYLES}

  color: ${({ color }) => (color !== 'standard' ? 'inherit' : null)};
  text-decoration: ${({ color }) =>
    color === 'standard' ? 'none' : 'underline'};

  &:hover {
    color: ${linkHover};
    ${({ color }) =>
      color === 'standard'
        ? ''
        : css`
            color: inherit;
          `};
  }

  &:focus {
    outline: none;
  }
`;

export const Link = styled.a<Partial<ContentProps>>`
  ${linkStyles};
`;

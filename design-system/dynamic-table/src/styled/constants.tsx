import { css } from 'styled-components';

import { N30A } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { ASC, DESC } from '../internal/constants';
import { arrow, MSThemeColors } from '../theme';
import { SortOrderType } from '../types';

export interface TruncateStyleProps {
  width?: number;
  isFixedSize?: boolean;
  shouldTruncate?: boolean;
}

export const truncateStyle = ({
  width,
  isFixedSize,
  shouldTruncate,
}: TruncateStyleProps) => css`
  ${width
    ? css`
        width: ${width}%;
      `
    : ''} ${isFixedSize
    ? css`
        overflow: hidden;
      `
    : ''};
  ${isFixedSize && shouldTruncate
    ? css`
        text-overflow: ellipsis;
        white-space: nowrap;
      `
    : ''};
`;

export const onClickStyle = ({ onClick }: { onClick?: boolean }) =>
  onClick &&
  css`
    &:hover {
      cursor: pointer;
      background-color: ${N30A};
    }
  `;

export const arrowsStyle = (props: {
  isSortable?: boolean;
  sortOrder?: SortOrderType;
}) => {
  const { isSortable, sortOrder } = props;

  if (!isSortable) {
    return '';
  }

  const pseudoBase = css`
    border: 3px solid transparent;
    display: block;
    height: 0;
    position: absolute;
    right: -${gridSize}px;
    width: 0;

    @media (forced-colors: active) {
      border: 3px solid ${MSThemeColors.Background};
    }
  `;

  return css`
    & > span {
      position: relative;
      &::before {
        ${pseudoBase};
        border-bottom: 3px solid
          ${sortOrder === ASC
            ? arrow.selectedColor(props)
            : arrow.defaultColor(props)};
        bottom: 8px;
        content: ' ';
      }
      &::after {
        ${pseudoBase};
        border-top: 3px solid
          ${sortOrder === DESC
            ? arrow.selectedColor(props)
            : arrow.defaultColor(props)};
        bottom: 0;
        content: ' ';
      }
    }

    &:hover > span {
      &::before {
        border-bottom: 3px solid
          ${sortOrder === ASC
            ? arrow.selectedColor(props)
            : arrow.hoverColor(props)};
      }
      &::after {
        border-top: 3px solid
          ${sortOrder === DESC
            ? arrow.selectedColor(props)
            : arrow.hoverColor(props)};
      }
    }

    @media (forced-colors: active) {
      & > span {
        &::before {
          border-bottom: 3px solid
            ${sortOrder === ASC
              ? MSThemeColors.SelectedBackground
              : MSThemeColors.Text};
        }
        &::after {
          border-top: 3px solid
            ${sortOrder === DESC
              ? MSThemeColors.SelectedBackground
              : MSThemeColors.Text};
        }
      }

      &:hover > span {
        &::before {
          border-bottom: 3px solid
            ${sortOrder === ASC
              ? MSThemeColors.SelectedBackground
              : MSThemeColors.Text};
        }
        &::after {
          border-top: 3px solid
            ${sortOrder === DESC
              ? MSThemeColors.SelectedBackground
              : MSThemeColors.Text};
        }
      }
    }
  `;
};

export const cellStyle = css`
  border: none;
  padding: ${gridSize() / 2}px ${gridSize}px;
  text-align: left;

  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`;

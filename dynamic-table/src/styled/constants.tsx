import { css } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { N30A } from '@atlaskit/theme/colors';
import { divide } from '@atlaskit/theme/math';
import { ASC, DESC } from '../internal/constants';
import { arrow } from '../theme';
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
  `;
};

export const cellStyle = css`
  border: none;
  padding: ${divide(gridSize, 2)}px ${gridSize}px;
  text-align: left;

  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`;

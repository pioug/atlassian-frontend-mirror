import styled, { css } from 'styled-components';

import { B100 } from '@atlaskit/theme/colors';

import { head } from '../theme';
import { SortOrderType } from '../types';

import {
  arrowsStyle,
  cellStyle,
  onClickStyle,
  truncateStyle,
  TruncateStyleProps,
} from './constants';

const rankingStyles = css`
  display: block;
`;

interface HeadProps {
  isRanking?: boolean;
}

export const Head = styled.thead<HeadProps>`
  border-bottom: 2px solid ${head.borderColor};
  ${({ isRanking }) => isRanking && rankingStyles};
`;

interface HeadCellProps extends TruncateStyleProps {
  onClick?: () => void;
  isSortable?: boolean;
  sortOrder?: SortOrderType;
}

export const HeadCell = styled.th<HeadCellProps>`
  ${({ onClick }) => onClickStyle({ onClick: Boolean(onClick) })}
  ${(p) => truncateStyle(p)} 
  ${(p) =>
    arrowsStyle(p)} 
  ${cellStyle} 
  border: none;
  color: ${head.textColor};
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 600;
  position: relative;
  text-align: left;
  vertical-align: top;
  &:focus {
    outline: solid 2px ${B100};
  }
`;

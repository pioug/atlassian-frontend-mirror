import styled, { css } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

export interface TableProps {
  isFixedSize?: boolean;
}

export const Table = styled.table<TableProps>`
  ${({ isFixedSize }) =>
    isFixedSize &&
    css`
      table-layout: fixed;
    `};
  border-collapse: collapse;
  width: 100%;
`;

export const Caption = styled.caption`
  font-size: 1.42857143em;
  /* there is a bug in Safari: if element which creates a new stacking context
     is a child of a table, table caption re-renders in bad wrong position
     https://stackoverflow.com/questions/44009186/safari-bug-translating-table-row-group-using-gsap-make-caption-jump-to-bottom
  */
  will-change: transform;
  font-style: inherit;
  font-weight: 500;
  letter-spacing: -0.008em;
  line-height: 1.2;
  margin-bottom: ${gridSize}px;
  margin-top: ${multiply(gridSize, 3.5)}px;
  text-align: left;
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

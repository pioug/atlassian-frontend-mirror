import styled, { css } from 'styled-components';

import { TableBodyCell } from '../TableCell';

const rankingStyles = css`
  box-sizing: border-box;
`;

export const RankableTableBodyCell = styled(TableBodyCell)`
  ${({ isRanking }: { isRanking: boolean }) => isRanking && rankingStyles};
`;

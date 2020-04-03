import styled, { css } from 'styled-components';
import { N20, B100 } from '@atlaskit/theme/colors';
import { e500 } from '@atlaskit/theme/elevation';
import { TableBodyRow } from '../TableRow';

const rankingStyles = css`
  display: block;
`;

/**
 * TODO: Pass the props here to get particular theme for the table
 * Skipping it for now as it may impact migration as util-shared-styles does not support this feature
 */
const rankingItemStyles = css`
  background-color: ${N20};
  ${e500()} border-radius: 2px;
`;

const draggableStyles = ({
  isRanking,
  isRankingItem,
}: {
  isRanking?: boolean;
  isRankingItem?: boolean;
}) => css`
  ${isRanking && rankingStyles} ${isRankingItem && rankingItemStyles} &:focus {
    outline-style: solid;
    outline-color: ${B100};
    outline-width: 2px;
  }
`;

export const RankableTableBodyRow = styled(TableBodyRow)`
  ${draggableStyles};
`;

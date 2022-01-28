/** @jsx jsx */
import { forwardRef, HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/core';

import { B100, N20, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ITableRowProps, TableBodyRow } from '../TableRow';

export type RankableTableBodyRowProps = HTMLAttributes<HTMLTableRowElement> &
  ITableRowProps & {
    isRanking?: boolean;
    isRankingItem?: boolean;
  };

const rankingStyles = css({
  display: 'block',
});

const elevationStyle = token(
  'elevation.shadow.overlay',
  `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`,
);

/**
 * TODO: Pass the props here to get particular theme for the table
 * Skipping it for now as it may impact migration as util-shared-styles does not support this feature
 */
const rankingItemStyles = css({
  backgroundColor: token('color.background.neutral', N20),
  boxShadow: elevationStyle,
  borderRadius: '2px',
});

const draggableStyles = css({
  '&:focus': {
    outlineStyle: 'solid',
    outlineColor: token('color.border.focused', B100),
  },
  outlineWidth: '2px',
});

export const RankableTableBodyRow = forwardRef<
  HTMLTableRowElement,
  RankableTableBodyRowProps
>(({ isRanking, isRankingItem, ...props }, ref) => {
  return (
    <TableBodyRow
      css={[
        isRanking && rankingStyles,
        isRankingItem && rankingItemStyles,
        draggableStyles,
      ]}
      ref={ref}
      {...props}
    />
  );
});

/** @jsx jsx */
import { forwardRef, HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/react';

import { B100, N20, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ITableRowProps, TableBodyRow } from '../table-row';

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
  borderRadius: '2px',
  boxShadow: elevationStyle,
});

const draggableStyles = css({
  outlineWidth: '2px',
  '&:focus': {
    outlineColor: token('color.border.focused', B100),
    outlineStyle: 'solid',
  },
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
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

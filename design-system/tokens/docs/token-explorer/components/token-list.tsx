/** @jsx jsx */
import { Fragment, memo } from 'react';

import { css, jsx } from '@emotion/react';

import { Box, Inline, Stack } from '@atlaskit/primitives';
import { UNSAFE_media as media } from '@atlaskit/primitives/responsive';

import { token } from '../../../src';
import type { TransformedTokenMerged } from '../types';
import { getTokenListColumnNames } from '../utils';

import NoResults from './no-results';
import TokenRow from './token-row';

const listStyles = css({
  display: 'flex',
  margin: 0,
  padding: 0,
  gap: token('space.200', '16px'),
  flexDirection: 'column',
  listStyle: 'none',
  [media.below.sm]: {
    gap: token('space.300', '24px'),
  },
});

const listHeaderStyles = css({
  position: 'sticky',
  zIndex: 1,
  backgroundColor: token('elevation.surface', '#FFFFFF'),
  borderBottom: `2px solid ${token('color.border', '#091E4224')}`,
  paddingBlock: token('space.050', '4px'),
});

const listHeaderValueColumnStyles = css({
  [media.below.sm]: {
    display: 'none',
  },
});

export interface TokenListProps {
  /**
   * Offset the sticky table header to avoid overlapping existing fixed elements.
   */
  scrollOffset?: number;
  list?: TransformedTokenMerged[];
  isLoading?: boolean;
  testId?: string;
}

const TokenList = ({
  list,
  scrollOffset = 0,
  isLoading,
  testId,
}: TokenListProps) => {
  if (list !== undefined && list.length === 0) {
    return <NoResults />;
  }

  const group = list && list[0].attributes.group;
  const columnNames = getTokenListColumnNames(group);

  return (
    <Stack space="200" testId={testId && `${testId}-token-list`}>
      <ListHeader columnNames={columnNames} scrollOffset={scrollOffset} />
      {/* This should be a Stack but currently cannot set Stack to render as `ul` or override list styles */}
      <ul css={listStyles}>
        {isLoading ? (
          <Fragment>
            <TokenRow key={1} isLoading />
            <TokenRow key={2} isLoading />
            <TokenRow key={3} isLoading />
            <TokenRow key={4} isLoading />
            <TokenRow key={5} isLoading />
          </Fragment>
        ) : (
          list?.map((tokenItem) => (
            <TokenRow key={tokenItem.name} token={tokenItem} testId={testId} />
          ))
        )}
      </ul>
    </Stack>
  );
};

type ListHeaderProps = {
  columnNames: string[];
} & Pick<TokenListProps, 'scrollOffset'>;

const ListHeader = ({ scrollOffset, columnNames }: ListHeaderProps) => (
  <div css={[listHeaderStyles, { top: scrollOffset }]}>
    <Inline space="200" spread="space-between">
      <ColumnHeader columnName={columnNames[0]} isFirstColumn />
      <div css={listHeaderValueColumnStyles}>
        <Inline space="200">
          {columnNames.slice(1).map((columnName) => (
            <ColumnHeader key={columnName} columnName={columnName} />
          ))}
        </Inline>
      </div>
    </Inline>
  </div>
);

interface ColumnHeaderProps {
  columnName: string;
  isFirstColumn?: boolean;
}

const ColumnHeader = ({ columnName, isFirstColumn }: ColumnHeaderProps) => (
  <Box key={columnName} width={!isFirstColumn ? 'size.600' : undefined}>
    <strong>{columnName}</strong>
  </Box>
);

export default memo(TokenList);

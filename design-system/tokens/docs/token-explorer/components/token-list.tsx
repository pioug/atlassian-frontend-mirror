/** @jsx jsx */
import { Fragment, memo } from 'react';

import { css, jsx } from '@emotion/core';

import { token } from '../../../src';
import type { TransformedTokenMerged } from '../types';

import NoResults from './no-results';
import TokenItem from './token-item';

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

  return (
    <table data-testid={testId && `${testId}-token-list`}>
      <thead
        css={{
          '@media (max-width: 1080px)': {
            display: 'none',
          },
        }}
      >
        <tr
          css={[
            {
              position: 'sticky',
              backgroundColor: token('elevation.surface', '#FFFFFF'),
            },
            scrollOffset ? css({ top: scrollOffset }) : undefined,
          ]}
        >
          <th>Token and description</th>
          <th>Light value</th>
          <th>Dark value</th>
        </tr>
      </thead>
      <tbody css={{ borderBottom: 0 }}>
        {isLoading ? (
          <Fragment>
            <TokenItem key={1} isLoading />
            <TokenItem key={2} isLoading />
            <TokenItem key={3} isLoading />
            <TokenItem key={4} isLoading />
            <TokenItem key={5} isLoading />
          </Fragment>
        ) : (
          list?.map((tokenItem) => (
            <TokenItem key={tokenItem.name} token={tokenItem} testId={testId} />
          ))
        )}
      </tbody>
    </table>
  );
};

export default memo(TokenList);

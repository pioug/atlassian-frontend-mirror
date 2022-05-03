/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { token } from '../../../src';
import type { TransformedTokenExtended } from '../grouped-tokens';

import TokenItem from './token-item';

export interface TokenListProps {
  /**
   * Offset the sticky table header to avoid overlapping existing fixed elements.
   */
  scrollOffset?: number;
  list: TransformedTokenExtended[];
  searchQuery?: string;
}

const TokenList = ({ list, scrollOffset = 0, searchQuery }: TokenListProps) => (
  <table>
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
    <tbody>
      {list.map((token) => (
        <TokenItem key={token.name} {...token} searchQuery={searchQuery} />
      ))}
    </tbody>
  </table>
);

export default TokenList;

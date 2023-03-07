/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { UNSAFE_media as media } from '@atlaskit/grid';
import { Stack } from '@atlaskit/primitives';

import { token } from '../../../src';
import type { TransformedTokenGrouped } from '../types';

import TokenDefinition from './token-definition';
import TokenDescription from './token-description';
import TokenLifecycle from './token-lifecycle';

const tokenRowStyles = css({
  margin: 0,
  paddingBottom: token('space.200', '16px'),
  borderBottom: `1px solid ${token('color.border', '#091E4224')}`,
  [media.below.sm]: {
    paddingBottom: token('space.300', '24px'),
  },
});

const tokenRowStackStyles = css({
  display: 'flex',
  gap: token('space.100', '8px'),
  flexDirection: 'column',
  [media.below.sm]: {
    gap: token('space.300', '24px'),
  },
});

interface TokenRowProps {
  token?: TransformedTokenGrouped;
  isLoading?: boolean;
  testId?: string;
}

/**
 * Represents a row in the token list which can comprise one or more `TokenDefinition`s.
 * For example a `TokenRow` can contain one TokenDefintion, or multiple `TokenDefinition`s if the token has extensions (hovered, pressed).
 *
 * Renders as a list item (`li`).
 *
 * For tokens with extensions, this component is also responsible for rendering the description for the token grouping.
 */
const TokenRow = ({
  token: transformedToken,
  isLoading,
  testId,
}: TokenRowProps) => {
  if (!transformedToken) {
    return null;
  }

  const extensions = transformedToken.extensions || [];
  const hasExtenstions = extensions.length > 0;

  return (
    <li css={tokenRowStyles}>
      <div css={tokenRowStackStyles}>
        {[transformedToken].concat(extensions).map((token) => (
          <TokenDefinition
            key={token.name}
            token={token}
            shouldHideDescription={hasExtenstions}
            testId={testId && `${testId}-token-item`}
          />
        ))}
        {hasExtenstions && (
          <Stack space="150">
            <TokenDescription
              transformedToken={transformedToken}
              isLoading={isLoading}
            />
            <TokenLifecycle
              transformedToken={transformedToken}
              isLoading={isLoading}
            />
          </Stack>
        )}
      </div>
    </li>
  );
};

export default TokenRow;

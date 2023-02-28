/** @jsx jsx */

import { jsx } from '@emotion/react';

import { Box, Inline, Stack } from '@atlaskit/primitives';

import { TransformedTokenGrouped } from '../types';
import { getTokenListColumnNames } from '../utils';

import TokenButtonValue from './token-button-value';
import TokenDescription from './token-description';
import TokenLifecycle from './token-lifecycle';
import TokenName from './token-name';

interface TokenDefinitionProps {
  token?: TransformedTokenGrouped;
  shouldHideDescription?: boolean;
  isLoading?: boolean;
  testId?: string;
}

/**
 * Represents a single token consisting of token name, description, and its value(s).
 *
 * Values can be a single value for spacing, or two values (light and dark) for color.
 *
 * For tokens with extensions, the description for the token grouping is rendered by `TokenRow` for the whole grouping (rather than for each definition).
 */
const TokenDefinition = ({
  token,
  shouldHideDescription,
  isLoading,
  testId,
}: TokenDefinitionProps) => {
  if (!token) {
    return null;
  }

  const group = token && token.attributes.group;
  const isSpacingToken = group === 'spacing';
  const columnNames = getTokenListColumnNames(group);

  const pixelValue =
    token &&
    token.attributes.state === 'active' &&
    group === 'spacing' &&
    token.attributes.pixelValue;

  const tokenValues = isSpacingToken
    ? [
        {
          name: columnNames[1],
          value: pixelValue,
          attributes: token.attributes,
          original: token.original,
          testId: `${testId}-token-item-value-${
            isLoading || pixelValue === undefined ? 'loading' : pixelValue
          }`,
        },
      ]
    : [
        {
          name: columnNames[1],
          value: token.value,
          attributes: token.attributes,
          original: token.original,
          testId: `${testId}-token-item-value-${
            isLoading || pixelValue === undefined
              ? 'loading'
              : token.original.value
          }`,
        },
        {
          name: columnNames[2],
          value: token.darkToken.value,
          attributes: token.darkToken.attributes,
          original: token.darkToken.original,
          testId: `${testId}-token-item-value-${
            isLoading || pixelValue === undefined
              ? 'loading'
              : token.darkToken.original.value
          }`,
        },
      ];

  return (
    <Inline space="300" spread="space-between" testId={testId}>
      <Box display="block" flexGrow="1">
        <Stack space="150">
          <Stack space="100">
            <TokenName name={token.name} attributes={token.attributes} />
            {!shouldHideDescription && !isSpacingToken && (
              <TokenDescription transformedToken={token} />
            )}
          </Stack>
          {!shouldHideDescription && (
            <TokenLifecycle transformedToken={token} />
          )}
        </Stack>
      </Box>
      <Inline space="200">
        {tokenValues.map((tokenValue) => (
          <TokenButtonValue
            key={tokenValue.name}
            hasFixedWidth
            value={tokenValue.value}
            attributes={tokenValue.attributes}
            original={tokenValue.original}
            variantLabel={tokenValue.name}
            testId={tokenValue.testId}
          />
        ))}
      </Inline>
    </Inline>
  );
};

export default TokenDefinition;

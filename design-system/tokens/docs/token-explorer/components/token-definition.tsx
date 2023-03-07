/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { UNSAFE_media as media } from '@atlaskit/grid';
import { Box, Inline, Stack } from '@atlaskit/primitives';

import { token } from '../../../src';
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

const tokenDefinitionContainerStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  justifyContent: 'space-between',
  gap: token('space.200', '16px'),
  [media.below.sm]: {
    flexDirection: 'column',
  },
});

const tokenValueLabelStyles = css({
  display: 'inline-block',
  marginBottom: token('space.050', '4px'),
  color: token('color.text.subtlest', '#626F86'),
  fontSize: token('font.size.075', '12px'),
  fontWeight: token('font.weight.regular', '400'),
  lineHeight: token('font.lineHeight.100', '16px'),
  [media.above.md]: {
    display: 'none',
  },
});

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

  const group = token.attributes.group;
  const isSpacingToken = group === 'spacing';
  const columnNames = getTokenListColumnNames(group);

  const pixelValue =
    token.attributes.state === 'active' &&
    isSpacingToken &&
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
    <div css={tokenDefinitionContainerStyles} data-testid={testId}>
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
          <div key={tokenValue.name}>
            <span css={tokenValueLabelStyles}>{tokenValue.name}</span>
            <TokenButtonValue
              isFixedWidth
              value={tokenValue.value}
              attributes={tokenValue.attributes}
              original={tokenValue.original}
              variantLabel={tokenValue.name}
              testId={tokenValue.testId}
            />
          </div>
        ))}
      </Inline>
    </div>
  );
};

export default TokenDefinition;

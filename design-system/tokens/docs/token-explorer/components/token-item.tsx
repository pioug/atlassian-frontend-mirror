/** @jsx jsx */
import { useMemo } from 'react';

import { css, jsx } from '@emotion/core';

import { N200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import darkTheme from '../../../src/artifacts/tokens-raw/atlassian-dark';
import { getTokenId } from '../../../src/utils/token-ids';
import type { TransformedTokenExtended } from '../grouped-tokens';

import CopyButtonValue from './copy-button-value';
import TokenItemName from './token-item-name';

const cellStyles = css({
  paddingBlock: 16,
  verticalAlign: 'top',

  '@media (max-width: 1080px)': {
    display: 'block',
    padding: '0 0 20px',

    '&:first-of-type': {
      paddingTop: 20,
    },
  },
});

const tokenValueCellStyles = css({
  '@media (max-width: 1080px)': {
    width: '50%',

    '&::before': {
      content: 'attr(data-title)',
    },
  },

  '@media (min-width: 1080px)': {
    width: 130,
  },
});

const buttonStyles = css({
  marginBottom: gridSize(),
});

const valueButtonStyles = css([
  buttonStyles,
  {
    '@media (max-width: 1080px)': {
      marginTop: gridSize(),
      marginBottom: 0,
    },
    '@media (min-width: 1081px)': {
      width: '100%',
    },
  },
]);

interface TokenItemProps extends TransformedTokenExtended {
  searchQuery?: string;
}

const TokenItem = ({
  name,
  value,
  attributes,
  original,
  extensions,
  searchQuery,
}: TokenItemProps) => {
  const darkToken = useMemo(
    () => darkTheme.find((token) => token.name === name),
    [name],
  );

  return (
    <tr
      css={{
        borderBottom: `1px solid ${token('color.border', '#091E4224')}`,
      }}
    >
      <td css={cellStyles}>
        <TokenItemName
          name={name}
          attributes={attributes}
          css={buttonStyles}
          searchQuery={searchQuery}
        />
        {extensions?.map((extension) => (
          <TokenItemName
            key={extension.name}
            name={extension.name}
            attributes={extension.attributes}
            css={buttonStyles}
            searchQuery={searchQuery}
          />
        ))}
        <p css={{ margin: 0 }}>{attributes.description}</p>
        <p
          css={{
            color: token('color.text.subtlest', N200),
            fontSize: 12,
          }}
        >
          Introduced v{attributes.introduced}
          {'deprecated' in attributes &&
            ` → Deprecated v${attributes.deprecated}`}
          {'deleted' in attributes && ` → Deleted v${attributes.deleted}`}
          {'replacement' in attributes &&
            `. Replace with ${
              Array.isArray(attributes.replacement)
                ? attributes.replacement.map(
                    (replacement, i) =>
                      `${getTokenId(replacement)}${i > 0 ? ' / ' : ' '}`,
                  )
                : getTokenId(attributes.replacement)
            }`}
        </p>
      </td>
      <td css={[cellStyles, tokenValueCellStyles]} data-title="Light value">
        <CopyButtonValue
          value={value}
          attributes={attributes}
          original={original}
          css={valueButtonStyles}
        />
        {extensions?.map((extension) => (
          <CopyButtonValue
            key={extension.name}
            value={extension.value}
            original={extension.original}
            attributes={extension.attributes}
            css={valueButtonStyles}
          />
        ))}
      </td>
      <td css={[cellStyles, tokenValueCellStyles]} data-title="Dark value">
        {darkToken && (
          <CopyButtonValue
            value={darkToken.value}
            original={darkToken.original}
            attributes={darkToken.attributes}
            css={valueButtonStyles}
          />
        )}
        {extensions?.map((extension) => {
          const dark = darkTheme.find((token) => token.name === extension.name);

          return dark ? (
            <CopyButtonValue
              key={dark.name}
              value={dark.value}
              original={dark.original}
              attributes={dark.attributes}
              css={valueButtonStyles}
            />
          ) : undefined;
        })}
      </td>
    </tr>
  );
};
export default TokenItem;

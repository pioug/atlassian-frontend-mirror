/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { N200 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import { getTokenId } from '../../../src/utils/token-ids';
import type { TransformedTokenGrouped } from '../types';

import CopyButtonValue from './copy-button-value';
import LoadingSkeleton from './loading-skeleton';
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

interface TokenItemProps {
  token?: TransformedTokenGrouped;
  isLoading?: boolean;
  testId?: string;
}

const TokenItem = ({
  token: transformedToken,
  isLoading,
  testId,
}: TokenItemProps) =>
  isLoading || transformedToken !== undefined ? (
    <tr
      css={{
        borderTop: `1px solid ${token('color.border', '#091E4224')}`,
      }}
      data-testid={testId && `${testId}-token-item`}
    >
      <td
        css={cellStyles}
        data-testid={
          testId &&
          `${testId}-token-item-name-${
            isLoading || transformedToken === undefined
              ? 'loading'
              : transformedToken.name
          }`
        }
      >
        {isLoading || transformedToken === undefined ? (
          <Fragment>
            <LoadingSkeleton
              width="30%"
              height={24}
              css={{ marginBottom: 10 }}
            />
            <LoadingSkeleton height={20} css={{ marginBottom: 10 }} />
            <LoadingSkeleton
              height={20}
              css={{ marginBottom: 10 }}
              width="20%"
            />
          </Fragment>
        ) : (
          <Fragment>
            <TokenItemName
              name={transformedToken.name}
              attributes={transformedToken.attributes}
              css={buttonStyles}
            />
            {transformedToken.extensions?.map((extension) => (
              <TokenItemName
                key={extension.name}
                name={extension.name}
                attributes={extension.attributes}
                css={buttonStyles}
              />
            ))}
            <p css={{ margin: 0 }}>{transformedToken.attributes.description}</p>
            <p
              css={{
                color: token('color.text.subtlest', N200),
                fontSize: 12,
              }}
            >
              Introduced v{transformedToken.attributes.introduced}
              {'deprecated' in transformedToken.attributes &&
                ` → Deprecated v${transformedToken.attributes.deprecated}`}
              {'deleted' in transformedToken.attributes &&
                ` → Deleted v${transformedToken.attributes.deleted}`}
              {'replacement' in transformedToken.attributes &&
                `. Replace with ${
                  Array.isArray(transformedToken.attributes.replacement)
                    ? transformedToken.attributes.replacement.map(
                        (replacement, i) =>
                          `${getTokenId(replacement)}${i > 0 ? ' / ' : ' '}`,
                      )
                    : getTokenId(transformedToken.attributes.replacement)
                }`}
            </p>
          </Fragment>
        )}
      </td>
      <td
        css={[cellStyles, tokenValueCellStyles]}
        data-title="Light value"
        data-testid={`${testId}-token-item-value-${
          isLoading || transformedToken === undefined
            ? 'loading'
            : transformedToken.original.value
        }`}
      >
        {isLoading || transformedToken === undefined ? (
          <LoadingSkeleton height={24} />
        ) : (
          <Fragment>
            <CopyButtonValue
              value={transformedToken.value}
              attributes={transformedToken.attributes}
              original={transformedToken.original}
              css={valueButtonStyles}
            />
            {transformedToken.extensions?.map((extension) => (
              <CopyButtonValue
                key={extension.name}
                value={extension.value}
                original={extension.original}
                attributes={extension.attributes}
                css={valueButtonStyles}
              />
            ))}
          </Fragment>
        )}
      </td>
      <td css={[cellStyles, tokenValueCellStyles]} data-title="Dark value">
        {isLoading || transformedToken === undefined ? (
          <LoadingSkeleton height={24} />
        ) : (
          <Fragment>
            {transformedToken.darkToken && (
              <CopyButtonValue
                value={transformedToken.darkToken.value}
                original={transformedToken.darkToken.original}
                attributes={transformedToken.darkToken.attributes}
                css={valueButtonStyles}
              />
            )}
            {transformedToken.extensions?.map((extension) => (
              <CopyButtonValue
                key={extension.darkToken.name}
                value={extension.darkToken.value}
                original={extension.darkToken.original}
                attributes={extension.darkToken.attributes}
                css={valueButtonStyles}
              />
            ))}
          </Fragment>
        )}
      </td>
    </tr>
  ) : null;

export default TokenItem;

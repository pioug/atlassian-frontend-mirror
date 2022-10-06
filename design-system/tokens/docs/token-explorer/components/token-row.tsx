/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

import { TransformedTokenGrouped } from '../types';

import LoadingSkeleton from './loading-skeleton';
import TokenButtonValue from './token-button-value';
import TokenDescription from './token-description';
import TokenItemName from './token-item-name';

const TokenRow: React.FC<{
  testId?: string;
  isLoading?: boolean;
  transformedToken?: TransformedTokenGrouped;
  showDescription?: boolean;
}> = (props) => {
  const { testId, isLoading, transformedToken, showDescription } = props;

  return (
    <tr
      css={{
        '@media (max-width: 1080px)': {
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <td
        css={nameCellStyles}
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
              css={{ marginBottom: gridSize() }}
            />
            {showDescription && (
              <TokenDescription transformedToken={transformedToken} />
            )}
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
          <TokenButtonValue
            value={transformedToken.value}
            attributes={transformedToken.attributes}
            original={transformedToken.original}
            css={valueButtonStyles}
          />
        )}
      </td>
      <td css={[cellStyles, tokenValueCellStyles]} data-title="Dark value">
        {isLoading || transformedToken === undefined ? (
          <LoadingSkeleton height={24} />
        ) : (
          transformedToken.darkToken && (
            <TokenButtonValue
              value={transformedToken.darkToken.value}
              original={transformedToken.darkToken.original}
              attributes={transformedToken.darkToken.attributes}
              css={valueButtonStyles}
            />
          )
        )}
      </td>
    </tr>
  );
};

const cellStyles = css({
  paddingTop: 0,
  paddingBottom: 0,
  verticalAlign: 'top',
});

const nameCellStyles = css({
  padding: 0,
  verticalAlign: 'top',
  '@media (max-width: 1080px)': {
    paddingBottom: 20,
  },
});

const tokenValueCellStyles = css({
  width: 130,
  paddingBottom: 10,
  '@media (max-width: 1080px)': {
    paddingLeft: 0,
    '&::before': {
      content: 'attr(data-title)',
    },
  },
});

const valueButtonStyles = css({
  marginBottom: gridSize(),
  '@media (max-width: 1080px)': {
    marginTop: gridSize(),
  },
});

export default TokenRow;

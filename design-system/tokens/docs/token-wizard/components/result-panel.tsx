/** @jsx jsx */
import { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { N40 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { token } from '../../../src';
import results from '../data/results';
import type { resultID } from '../types';

import TokenItem from './token-item';

const headerStyles = css({
  marginBottom: gridSize() * 4,
});

const leftContainerStyles = css({
  padding: 16,
  border: `1px solid ${token('color.border', N40)}`,
  borderRadius: 8,
  '@media (min-width: 480px)': {
    height: 492,
    overflow: 'scroll',
  },
});

const resultTitleStyles = css({
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
});

const dividerStyles = css({
  height: gridSize() * 2,
  border: 'none',
  borderTop: `1px solid ${token('color.border', '#ebecf0')}`,
});

/**
 * __Result panel__
 *
 * A result panel on the right-hand-side modal dialog to display suggested tokens and descriptions
 *
 */
const ResultPanel = ({ resultId }: { resultId: resultID }) => {
  return (
    <div css={leftContainerStyles}>
      <div css={headerStyles}>
        <h5 css={resultTitleStyles}>Your token is:</h5>
      </div>
      {results[resultId].suggestion.map((tokenName, index) => {
        return (
          <Fragment key={tokenName}>
            <TokenItem tokenName={tokenName} />
            {index < results[resultId].suggestion.length - 1 && (
              <hr css={dividerStyles} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ResultPanel;

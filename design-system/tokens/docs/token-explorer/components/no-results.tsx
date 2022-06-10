import React, { Fragment } from 'react';

import EmptyState from '@atlaskit/empty-state';

import noResultsImg from '../images/no-results.png';

const NoResults = () => (
  <EmptyState
    header="No results found"
    description={
      <Fragment>
        If you can't find what you're looking for, try using the token wizard,
        visiting the{' '}
        <a href="https://atlassian.design/components/tokens/usage">
          usage guidelines
        </a>
        , or{' '}
        <a href="https://atlassian.design/components/tokens/examples">
          example guidelines
        </a>
      </Fragment>
    }
    imageUrl={noResultsImg}
    imageHeight={146.5}
    imageWidth={160}
  />
);

export default NoResults;

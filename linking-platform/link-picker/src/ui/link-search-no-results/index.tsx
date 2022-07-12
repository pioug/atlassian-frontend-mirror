import React from 'react';
import EmptyState, { EmptyStateProps } from '@atlaskit/empty-state';

import noResultsImg from './no-results.svg';

const NoResults = (props: EmptyStateProps) => (
  <EmptyState
    {...props}
    imageUrl={noResultsImg}
    maxImageWidth={130}
    maxImageHeight={130}
  />
);

export default NoResults;

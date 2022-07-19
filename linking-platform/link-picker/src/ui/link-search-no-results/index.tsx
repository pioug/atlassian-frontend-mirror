import React from 'react';
import EmptyState, { EmptyStateProps } from '@atlaskit/empty-state';

import NoResultsSVG from './no-results-svg';

const NoResults = (props: EmptyStateProps) => (
  <EmptyState {...props} renderImage={() => <NoResultsSVG />} />
);

export default NoResults;

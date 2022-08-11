import React from 'react';
import EmptyState, { EmptyStateProps } from '@atlaskit/empty-state';

import GenericErrorSVG from '../../../common/generic-error-svg';

const LinkSearchError = (props: EmptyStateProps) => (
  <EmptyState {...props} renderImage={() => <GenericErrorSVG />} />
);

export default LinkSearchError;

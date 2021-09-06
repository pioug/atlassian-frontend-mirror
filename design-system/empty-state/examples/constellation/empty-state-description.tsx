import React from 'react';

import EmptyState from '../../src';

const EmptyStateDescriptionExample = () => {
  return (
    <EmptyState
      header="You don't have access to this issue"
      description="Make sure the issue exists in this project. If it does, ask a project admin for permission to see the project's issues."
    />
  );
};

export default EmptyStateDescriptionExample;

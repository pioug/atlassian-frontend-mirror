import React from 'react';

import { SpotlightCard } from '../../src';

const SpotlightCardActionsExample = () => {
  return (
    <SpotlightCard
      actions={[
        { text: 'Next', onClick: () => {} },
        { text: 'Dismiss', onClick: () => {}, appearance: 'subtle' },
      ]}
    >
      Quickly switch between your most recent projects by selecting the project
      name and icon.
    </SpotlightCard>
  );
};

export default SpotlightCardActionsExample;

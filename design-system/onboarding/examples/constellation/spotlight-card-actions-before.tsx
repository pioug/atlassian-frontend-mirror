import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { SpotlightCard } from '../../src';

const SpotlightCardActionsBeforeExample = () => {
  return (
    <SpotlightCard
      actionsBeforeElement="1/3"
      actions={[
        { text: 'Next', onClick: __noop },
        { text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
      ]}
    >
      Quickly switch between your most recent projects by selecting the project
      name and icon.
    </SpotlightCard>
  );
};

export default SpotlightCardActionsBeforeExample;

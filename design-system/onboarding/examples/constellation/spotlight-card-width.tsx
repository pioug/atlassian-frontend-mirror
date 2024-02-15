import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';
import { token } from '@atlaskit/tokens';

import { SpotlightCard } from '../../src';

const SpotlightCardWidth = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: token('space.300', '24px'),
      }}
    >
      <SpotlightCard
        width={200}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: __noop },
          { text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
        ]}
      >
        Select the project name and icon to quickly switch between your most
        recent projects.
      </SpotlightCard>
      <SpotlightCard
        width={400}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: __noop },
          { text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
        ]}
      >
        Select the project name and icon to quickly switch between your most
        recent projects.
      </SpotlightCard>{' '}
      <SpotlightCard
        width={600}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: __noop },
          { text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
        ]}
      >
        Select the project name and icon to quickly switch between your most
        recent projects.
      </SpotlightCard>
    </div>
  );
};

export default SpotlightCardWidth;

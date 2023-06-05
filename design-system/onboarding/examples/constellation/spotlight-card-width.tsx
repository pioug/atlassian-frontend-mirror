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
        Quickly switch between your most recent projects by selecting the
        project name and icon.
      </SpotlightCard>
      <SpotlightCard
        width={400}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: __noop },
          { text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
        ]}
      >
        Quickly switch between your most recent projects by selecting the
        project name and icon.
      </SpotlightCard>{' '}
      <SpotlightCard
        width={600}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: __noop },
          { text: 'Dismiss', onClick: __noop, appearance: 'subtle' },
        ]}
      >
        Quickly switch between your most recent projects by selecting the
        project name and icon.
      </SpotlightCard>
    </div>
  );
};

export default SpotlightCardWidth;

import React from 'react';

import { SpotlightCard } from '../../src';

const SpotlightCardWidth = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SpotlightCard
        width={200}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: () => {} },
          { text: 'Dismiss', onClick: () => {}, appearance: 'subtle' },
        ]}
      >
        Quickly switch between your most recent projects by selecting the
        project name and icon.
      </SpotlightCard>
      <SpotlightCard
        width={400}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: () => {} },
          { text: 'Dismiss', onClick: () => {}, appearance: 'subtle' },
        ]}
      >
        Quickly switch between your most recent projects by selecting the
        project name and icon.
      </SpotlightCard>{' '}
      <SpotlightCard
        width={600}
        heading="Switch it up"
        actions={[
          { text: 'Next', onClick: () => {} },
          { text: 'Dismiss', onClick: () => {}, appearance: 'subtle' },
        ]}
      >
        Quickly switch between your most recent projects by selecting the
        project name and icon.
      </SpotlightCard>
    </div>
  );
};

export default SpotlightCardWidth;

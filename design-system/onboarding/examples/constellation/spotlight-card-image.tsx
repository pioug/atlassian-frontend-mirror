import React from 'react';

import { SpotlightCard } from '../../src';
import spotlightImage from '../assets/this-is-new-jira.png';

const SpotlightCardHeadingExample = () => {
  return (
    <SpotlightCard
      image={<img src={spotlightImage} alt="" width="400" />}
      heading="Switch it up"
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

export default SpotlightCardHeadingExample;

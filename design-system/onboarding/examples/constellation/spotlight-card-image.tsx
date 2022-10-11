import React from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { SpotlightCard } from '../../src';
import spotlightImage from '../assets/this-is-new-jira.png';

const SpotlightCardHeadingExample = () => {
  return (
    <SpotlightCard
      image={<img src={spotlightImage} alt="" width="400" />}
      heading="Switch it up"
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

export default SpotlightCardHeadingExample;

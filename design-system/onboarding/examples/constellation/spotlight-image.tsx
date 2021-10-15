import React, { useState } from 'react';

import Button from '@atlaskit/button';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../../src';
import spotlightImage from '../assets/this-is-new-jira.png';

const SpotlightImageExample = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);
  return (
    <SpotlightManager>
      <SpotlightTarget name="switch">
        <Button>Switch projects</Button>
      </SpotlightTarget>
      <div style={{ marginTop: '16px' }}>
        <Button appearance="primary" onClick={() => start()}>
          Show example spotlight
        </Button>
      </div>

      <SpotlightTransition>
        {isSpotlightActive && (
          <Spotlight
            image={spotlightImage}
            actions={[
              {
                onClick: () => end(),
                text: 'OK',
              },
            ]}
            target="switch"
            key="switch"
            targetRadius={3}
            targetBgColor={N0}
          >
            Quickly switch between your most recent projects by selecting the
            project name and icon.
          </Spotlight>
        )}
      </SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightImageExample;

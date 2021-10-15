import React, { useState } from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
  SpotlightTransition,
} from '../../src';

const SpotlightPulseExample = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);
  return (
    <SpotlightManager>
      <ButtonGroup>
        <SpotlightTarget name="new">
          <SpotlightPulse radius={3}>
            <Button onClick={() => start()}>New feature</Button>
          </SpotlightPulse>
        </SpotlightTarget>
        <SpotlightTarget name="copy">
          <Button>Existing feature</Button>
        </SpotlightTarget>
      </ButtonGroup>

      <SpotlightTransition>
        {isSpotlightActive && (
          <Spotlight
            actions={[
              {
                onClick: () => end(),
                text: 'OK',
              },
            ]}
            heading="Spotlight pulse"
            target="new"
            key="new"
            targetRadius={3}
            targetBgColor={N0}
          >
            Announcing new features with a spotlight pulse is an onboarding
            pattern that you can explore.
          </Spotlight>
        )}
      </SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightPulseExample;

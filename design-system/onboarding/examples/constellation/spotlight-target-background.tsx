import React, { useState } from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../../src';

import CodeSandboxIcon from './example-components/code-sandbox-icon';

const SpotlightTargetBackground = () => {
  const [activeSpotlight, setActiveSpotlight] = useState<null | number>(null);
  const start = () => setActiveSpotlight(0);
  const next = () => setActiveSpotlight((activeSpotlight || 0) + 1);
  const back = () => setActiveSpotlight((activeSpotlight || 1) - 1);
  const end = () => setActiveSpotlight(null);

  const renderActiveSpotlight = () => {
    const spotlights = [
      <Spotlight
        actions={[
          {
            onClick: () => next(),
            text: 'Next',
          },
          { onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
        ]}
        heading="No targetBgColor set"
        target="codesandbox"
        key="codesandbox"
        targetRadius={3}
      >
        You can see that even though the spotlight pulse surrounds the button,
        it no longer stands out on the page.
      </Spotlight>,
      <Spotlight
        targetBgColor={N0}
        actions={[
          { onClick: () => end(), text: 'OK' },
          { onClick: () => back(), text: 'Go back', appearance: 'subtle' },
        ]}
        heading="With targetBg set"
        target="copy"
        key="copy"
        targetRadius={3}
      >
        Setting the `targetBgColor` ensures that the cloned spotlight target has
        all the context it needs to stand out properly.
      </Spotlight>,
    ];

    if (activeSpotlight === null) {
      return null;
    }

    return spotlights[activeSpotlight];
  };

  return (
    <SpotlightManager>
      <ButtonGroup>
        <SpotlightTarget name="codesandbox">
          <Button iconBefore={<CodeSandboxIcon />} />
        </SpotlightTarget>
        <SpotlightTarget name="copy">
          <Button iconBefore={<CopyIcon label="Copy" />} />
        </SpotlightTarget>
      </ButtonGroup>
      <div style={{ marginTop: '16px' }}>
        <Button appearance="primary" onClick={() => start()}>
          Start example tour
        </Button>
      </div>

      <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightTargetBackground;

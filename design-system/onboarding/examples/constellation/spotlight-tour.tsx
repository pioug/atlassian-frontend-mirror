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

const SpotlightTourExample = () => {
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
        heading="Open CodeSandbox"
        target="codesandbox"
        key="codesandbox"
        targetRadius={3}
        targetBgColor={N0}
      >
        A sandboxed environment where you can play around with examples is now
        only one click away.
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: () => end(), text: 'OK' },
          { onClick: () => back(), text: 'Go back', appearance: 'subtle' },
        ]}
        heading="Copy code"
        target="copy"
        key="copy"
        targetRadius={3}
        targetBgColor={N0}
      >
        Trying to bring one of our components into your project? Click to copy
        the example code, then go ahead paste it in your editor.
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

export default SpotlightTourExample;

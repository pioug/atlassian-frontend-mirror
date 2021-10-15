import React, { useState } from 'react';

import Avatar from '@atlaskit/avatar';
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

const SpotlightTargetRadius = () => {
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
        targetBgColor={N0}
      >
        A sandboxed environment where you can play around with examples is now
        only one click away.
      </Spotlight>,
      <Spotlight
        targetRadius={3}
        actions={[
          { onClick: () => next(), text: 'Next' },
          { onClick: () => back(), text: 'Go back', appearance: 'subtle' },
          { onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
        ]}
        heading="Copy code"
        target="copy"
        key="copy"
        targetBgColor={N0}
      >
        Trying to bring one of our components into your project? Click to copy
        the example code, then go ahead paste it in your editor.
      </Spotlight>,
      <Spotlight
        targetRadius={24}
        actions={[
          { onClick: () => end(), text: 'OK' },
          { onClick: () => back(), text: 'Go back', appearance: 'subtle' },
        ]}
        heading="Upload a profile picture"
        target="avatar"
        key="avatar"
        targetBgColor={N0}
      >
        Having a profile picture helps you and your team by making your
        contributions more identifiable. If you'd rather remain mysterious,
        that's okay too! You do you.
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
      <SpotlightTarget name="avatar">
        <Avatar />
      </SpotlightTarget>
      <div style={{ marginTop: '16px' }}>
        <Button appearance="primary" onClick={() => start()}>
          Start example tour
        </Button>
      </div>

      <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightTargetRadius;

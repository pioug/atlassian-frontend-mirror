/** @jsx jsx */

import { jsx } from '@emotion/react';

import Button, { ButtonGroup } from '@atlaskit/button';

import { SpotlightManager, SpotlightPulse, SpotlightTarget } from '../src';

/**
 * This example shows how to use <SpotlightPulse />. This can be used when you want a pulse keyframe
 * on a target that is not active. Note that the pulse prop here is different to the one in <Spotlight />.
 */
const SpotlightPulseExample = () => {
  return (
    <div data-testid="spotlight-pulse-example">
      <SpotlightManager>
        <ButtonGroup>
          <SpotlightTarget name="pulse-true">
            <SpotlightPulse radius={3}>
              <Button>This displays a pulse</Button>
            </SpotlightPulse>
          </SpotlightTarget>
          <SpotlightTarget name="pulse-false">
            <SpotlightPulse pulse={false} radius={3}>
              <Button>This does not display a pulse</Button>
            </SpotlightPulse>
          </SpotlightTarget>
        </ButtonGroup>
      </SpotlightManager>
    </div>
  );
};

export default SpotlightPulseExample;

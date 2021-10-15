import React, { useState } from 'react';

import Button, { ButtonGroup } from '@atlaskit/button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
  useSpotlight,
} from '../../src';

import CodeSandboxIcon from './example-components/code-sandbox-icon';

const SpotlightWithConditionalTargets = () => {
  const [active, setActive] = useState<number | null>(null);
  const [isSecondTargetVisible, setIsSecondTargetVisible] = useState(true);
  const { isTargetRendered } = useSpotlight();

  const start = () => setActive(0);
  const next = () => setActive((active || 0) + 1);
  const back = () => setActive((active || 0) - 1);
  const end = () => setActive(null);

  const renderActiveSpotlight = () => {
    if (active == null) {
      return null;
    }

    const spotlights = [
      {
        target: 'codesandbox',
        element: (
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
            A sandboxed environment where you can play around with examples is
            now only one click away.
          </Spotlight>
        ),
      },
      {
        target: 'copy',
        element: (
          <Spotlight
            actions={[
              { onClick: () => next(), text: 'Next' },
              { onClick: () => back(), text: 'Go back', appearance: 'subtle' },
              { onClick: () => end(), text: 'Dismiss', appearance: 'subtle' },
            ]}
            heading="Copy code"
            target="copy"
            key="copy"
            targetRadius={3}
            targetBgColor={N0}
          >
            Trying to bring one of our components into your project? Click to
            copy the example code, then go ahead paste it in your editor.
          </Spotlight>
        ),
      },
      {
        target: 'expand',
        element: (
          <Spotlight
            actions={[
              { onClick: () => end(), text: 'OK' },
              { onClick: () => back(), text: 'Go back', appearance: 'subtle' },
            ]}
            heading="Expand to full screen"
            target="expand"
            key="expand"
            targetRadius={3}
            targetBgColor={N0}
          >
            For a focused view of the example, you can expand to full screen.
          </Spotlight>
        ),
      },
    ]
      .filter(({ target }) => isTargetRendered(target))
      .map(({ element }) => element);

    return spotlights[active];
  };

  return (
    <>
      <ButtonGroup>
        <SpotlightTarget name="codesandbox">
          <Button iconBefore={<CodeSandboxIcon />} />
        </SpotlightTarget>
        {isSecondTargetVisible && (
          <SpotlightTarget name="copy">
            <Button iconBefore={<CopyIcon label="Copy" />} />
          </SpotlightTarget>
        )}
        <SpotlightTarget name="expand">
          <Button iconBefore={<VidFullScreenOnIcon label="Full screen" />} />
        </SpotlightTarget>
      </ButtonGroup>

      <div style={{ marginTop: '16px' }}>
        <ButtonGroup>
          <Button appearance="primary" onClick={() => start()}>
            Start example tour
          </Button>
          <Button
            onClick={() => setIsSecondTargetVisible(!isSecondTargetVisible)}
          >
            Show/hide second spotlight target
          </Button>
        </ButtonGroup>
      </div>

      <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
    </>
  );
};

export default function SpotlightWithConditionalTargetsExample() {
  return (
    <SpotlightManager>
      <SpotlightWithConditionalTargets />
    </SpotlightManager>
  );
}

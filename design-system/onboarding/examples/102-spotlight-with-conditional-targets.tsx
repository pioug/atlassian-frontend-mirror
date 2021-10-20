import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
  useSpotlight,
} from '../src';

import { Highlight, HighlightGroup } from './styled';

function SpotlightWithConditionalTargets() {
  const [active, setActive] = useState<number | null>(null);
  const [isSpotlightVisible, setSpotlightVisibility] = useState(true);
  const { isTargetRendered } = useSpotlight();

  const start = () => setActive(0);

  const next = () => setActive((active || 0) + 1);

  const prev = () => setActive((active || 0) - 1);

  const finish = () => setActive(null);

  const renderActiveSpotlight = () => {
    if (active == null) {
      return null;
    }

    const variants = [
      {
        target: 'green',
        element: (
          <Spotlight
            actions={[
              {
                onClick: next,
                text: 'Tell me more',
              },
            ]}
            dialogPlacement="bottom left"
            heading="Green"
            target="green"
            key="green"
            testId="spotlight1"
          >
            <Lorem count={1} />
          </Spotlight>
        ),
      },
      {
        target: 'yellow',
        element: (
          <Spotlight
            actions={[
              { onClick: next, text: 'Next' },
              { onClick: prev, text: 'Prev', appearance: 'subtle' },
            ]}
            dialogPlacement="bottom center"
            heading="Yellow"
            target="yellow"
            key="yellow"
            testId="spotlight2"
          >
            <Lorem count={1} />
          </Spotlight>
        ),
      },
      {
        target: 'red',
        element: (
          <Spotlight
            actions={[{ onClick: finish, text: 'Got it' }]}
            dialogPlacement="bottom right"
            heading="Red"
            target="red"
            key="red"
            testId="spotlight3"
          >
            <Lorem count={1} />
          </Spotlight>
        ),
      },
    ]
      .filter(({ target }) => isTargetRendered(target))
      .map(({ element }) => element);

    return variants[active];
  };

  return (
    <>
      <HighlightGroup>
        <SpotlightTarget name="green">
          <Highlight color="green">First Element</Highlight>
        </SpotlightTarget>
        {isSpotlightVisible && (
          <SpotlightTarget name="yellow">
            <Highlight color="yellow">Second Element</Highlight>
          </SpotlightTarget>
        )}
        <SpotlightTarget name="red">
          <Highlight color="red">Third Element</Highlight>
        </SpotlightTarget>
      </HighlightGroup>

      <div style={{ marginTop: '1em' }}>
        <button
          id="Hide"
          type="submit"
          onClick={() => setSpotlightVisibility(!isSpotlightVisible)}
        >
          Hide/Show second spotlight target
        </button>
      </div>

      <p style={{ marginBottom: '1em' }}>
        Use spotlight to highlight elements in your app to users.
      </p>

      <div>
        <button type="submit" id="Start" onClick={start}>
          Start
        </button>
      </div>

      <SpotlightTransition>{renderActiveSpotlight()}</SpotlightTransition>
    </>
  );
}

export default function SpotlightWithConditionalTargetsExample() {
  return (
    <SpotlightManager>
      <SpotlightWithConditionalTargets />
    </SpotlightManager>
  );
}

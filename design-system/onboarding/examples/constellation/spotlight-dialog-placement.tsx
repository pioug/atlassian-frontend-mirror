import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../../src';

type Placement = typeof options[number];

const options = [
  'top right',
  'top center',
  'top left',
  'right bottom',
  'right middle',
  'right top',
  'bottom left',
  'bottom center',
  'bottom right',
  'left top',
  'left middle',
  'left bottom',
] as const;

const SpotlightDialogPlacement = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const [dialogPlacement, setDialogPlacement] = useState(0);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);
  const shiftPlacementOption = () => {
    if (dialogPlacement !== options.length - 1) {
      return setDialogPlacement(dialogPlacement + 1);
    }
    return setDialogPlacement(0);
  };
  const placement = options[dialogPlacement];

  return (
    <SpotlightManager>
      <SpotlightTarget name="placement">
        <Button>Example target</Button>
      </SpotlightTarget>

      <div style={{ marginTop: '16px' }}>
        <Button appearance="primary" onClick={() => start()}>
          Show example spotlight
        </Button>
      </div>
      <SpotlightTransition>
        {isSpotlightActive ? (
          <Spotlight
            heading={`Dialog placement: ${placement}`}
            headingAfterElement={
              <Button
                iconBefore={<CrossIcon label="Close" primaryColor={N0} />}
                onClick={() => end()}
              />
            }
            actions={[
              {
                onClick: () => shiftPlacementOption(),
                text: 'Shift dialog placement',
              },
            ]}
            dialogPlacement={placement as Placement}
            target="placement"
            key="placement"
            targetRadius={3}
            targetBgColor={N0}
          >
            You can set where the dialog should appear relative to the contents
            of the children. Try out the options by clicking the action below.
          </Spotlight>
        ) : null}
      </SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightDialogPlacement;

import React, { useState } from 'react';

import Button from '@atlaskit/button';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { N0 } from '@atlaskit/theme/colors';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../../src';

const SpotlightActionsAppearance = () => {
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const start = () => setIsSpotlightActive(true);
  const end = () => setIsSpotlightActive(false);
  return (
    <SpotlightManager>
      <SpotlightTarget name="action-button-appearances">
        <Button iconBefore={<SearchIcon label="Example" />} />
      </SpotlightTarget>
      <div style={{ marginTop: '16px' }}>
        <Button appearance="primary" onClick={() => start()}>
          Show example spotlight
        </Button>
      </div>

      <SpotlightTransition>
        {isSpotlightActive && (
          <Spotlight
            actions={[
              { onClick: () => end(), text: 'Default' },
              {
                appearance: 'subtle',
                onClick: () => end(),
                text: 'Subtle',
              },
              {
                appearance: 'subtle-link',
                onClick: () => end(),
                text: 'Subtle link',
              },
            ]}
            heading="Action button appearances"
            key="action-button-appearances"
            target="action-button-appearances"
            targetRadius={3}
            targetBgColor={N0}
          >
            You can change the default action button appearance to `subtle` or
            `subtle-link`.
          </Spotlight>
        )}
      </SpotlightTransition>
    </SpotlightManager>
  );
};

export default SpotlightActionsAppearance;

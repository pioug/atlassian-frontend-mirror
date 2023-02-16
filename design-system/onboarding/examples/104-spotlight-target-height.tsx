/** @jsx jsx */

import { useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { Spotlight, SpotlightManager, SpotlightTarget } from '../src';

const targetContainerStyles = css({
  width: 200,
  height: 400,
  margin: token('space.250', '20px'),
});

const targetStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: token('space.100', '8px'),
  alignItems: 'center',
  justifyContent: 'center',
  background: token('color.background.accent.gray.subtlest', N40),
});

function SpotlightTargetHeight() {
  const [active, setActive] = useState(true);

  return (
    <SpotlightManager>
      <Button appearance="primary" onClick={() => setActive(true)}>
        Show spotlight
      </Button>
      <div css={targetContainerStyles}>
        <SpotlightTarget name="spotlight-1">
          <div css={targetStyles}>
            <Lorem count={1} />
          </div>
        </SpotlightTarget>
        {active && (
          <Spotlight
            heading="I am a spotlight"
            dialogPlacement="right top"
            target="spotlight-1"
            actions={[{ onClick: () => setActive(false), text: 'OK' }]}
          >
            <Lorem count={1} />
          </Spotlight>
        )}
      </div>
    </SpotlightManager>
  );
}

export default SpotlightTargetHeight;

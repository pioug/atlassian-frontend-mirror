/** @jsx jsx */

import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/core';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { borderRadius } from '@atlaskit/theme/constants';

import {
  Spotlight,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

const wrapperStyles = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

const NewFeature: React.FC<{}> = () => {
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(false);

  const toggleIsSpotlightVisible = useCallback(() => {
    setIsSpotlightVisible((isSpotlightVisible) => !isSpotlightVisible);
  }, [setIsSpotlightVisible]);

  return (
    <div css={wrapperStyles}>
      <SpotlightManager blanketIsTinted={false}>
        <ButtonGroup>
          <SpotlightTarget name="button">
            <SpotlightPulse radius={borderRadius()}>
              <Button onClick={toggleIsSpotlightVisible}>
                I am a new feature
              </Button>
            </SpotlightPulse>
          </SpotlightTarget>
          <Button>Another element</Button>
        </ButtonGroup>
        <SpotlightTransition>
          {isSpotlightVisible && (
            <Spotlight
              target="button"
              heading="Switch it up"
              actionsBeforeElement="1/3"
              pulse={false}
              targetBgColor="#fff"
              actions={[
                {
                  onClick: toggleIsSpotlightVisible,
                  text: 'Got it',
                },
              ]}
            >
              It is now easier to create an issue. Click on the plus button to
              create a new issue.
            </Spotlight>
          )}
        </SpotlightTransition>
      </SpotlightManager>
    </div>
  );
};

export default NewFeature;

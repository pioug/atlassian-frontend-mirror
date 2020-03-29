import React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import { borderRadius } from '@atlaskit/theme';
import {
  Spotlight,
  SpotlightPulse,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

const Pulse = styled(SpotlightPulse)`
  position: static;
  border-radius: ${borderRadius}px;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

class NewFeature extends React.Component<{}, { spotlightVisible: boolean }> {
  state = {
    spotlightVisible: false,
  };

  render() {
    const { spotlightVisible } = this.state;
    return (
      <Wrapper>
        <SpotlightManager blanketIsTinted={false}>
          <ButtonGroup>
            <SpotlightTarget name="button">
              <Pulse>
                <Button
                  onClick={() =>
                    this.setState({ spotlightVisible: !spotlightVisible })
                  }
                >
                  I am a new feature
                </Button>
              </Pulse>
            </SpotlightTarget>
            <Button>Another element</Button>
          </ButtonGroup>
          <SpotlightTransition>
            {spotlightVisible && (
              <Spotlight
                target="button"
                heading="Switch it up"
                actionsBeforeElement="1/3"
                pulse={false}
                targetBgColor="#fff"
                actions={[
                  {
                    onClick: () =>
                      this.setState({ spotlightVisible: !spotlightVisible }),
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
      </Wrapper>
    );
  }
}

export default NewFeature;

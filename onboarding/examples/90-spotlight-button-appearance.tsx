import React, { Component } from 'react';
import styled from 'styled-components';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';
import { Highlight } from './styled';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

interface State {
  active: boolean;
}

export default class SpotlightDialogWidthExample extends Component<{}, State> {
  state: State = { active: false };

  start = () => this.setState({ active: true });

  finish = () => this.setState({ active: false });

  render() {
    const { active } = this.state;

    return (
      <Wrapper>
        <SpotlightManager>
          <SpotlightTarget name="custom-button-appearances">
            <Highlight color="neutral">Target</Highlight>
          </SpotlightTarget>
          <p>
            <button onClick={this.start}>Show</button>
          </p>
          <SpotlightTransition>
            {active && (
              <Spotlight
                actions={[
                  { onClick: this.finish, text: 'Default' },
                  {
                    appearance: 'subtle-link', //TODO: this is required
                    onClick: this.finish,
                    text: 'Subtle link',
                  },
                ]}
                dialogPlacement="top center"
                heading="Custom button appearances"
                key="custom-button-appearances"
                target="custom-button-appearances"
              >
                <p>
                  Spotlight provides theming for <code>default</code> and{' '}
                  <code>subtle-link</code> button appearances.
                </p>
              </Spotlight>
            )}
          </SpotlightTransition>
        </SpotlightManager>
      </Wrapper>
    );
  }
}

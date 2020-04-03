import React, { Component } from 'react';
import Button from '@atlaskit/button';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';
import { Highlight } from './styled';

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
      <SpotlightManager>
        <div>
          <div
            style={{
              position: 'fixed',
              height: '100vh',
              width: 300,
              background: 'salmon',
            }}
          >
            <div
              style={{
                position: 'relative',
              }}
            >
              <SpotlightTarget name="custom-button-appearances">
                <Highlight color="neutral">
                  <h1>Target</h1>
                </Highlight>
              </SpotlightTarget>
            </div>
          </div>
          <div style={{ marginLeft: 300, textAlign: 'center' }}>
            <h1>Scroll down and click on the button</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <h1>...</h1>
            <p>
              <Button onClick={this.start}>Show now</Button>
            </p>
            <h1>...</h1>
            <SpotlightTransition>
              {active && (
                <Spotlight
                  actions={[
                    { onClick: this.finish, text: 'Default' },
                    {
                      appearance: 'subtle-link',
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
          </div>
        </div>
      </SpotlightManager>
    );
  }
}

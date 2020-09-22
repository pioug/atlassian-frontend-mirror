import React, { Component } from 'react';

import Button from '@atlaskit/button/custom-theme-button';

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

export default class SpotlightTargetFixedPositionExample extends Component<
  {},
  State
> {
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
              <SpotlightTarget name="fixed-position">
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
                    { onClick: this.finish, text: 'Got it' },
                    {
                      appearance: 'subtle',
                      onClick: this.finish,
                      text: 'Back',
                    },
                  ]}
                  dialogPlacement="top center"
                  heading="Target is in a fixed position"
                  key="target-fixed-position"
                  target="fixed-position"
                >
                  <p>
                    Spotlight is used to introduce new features and
                    functionality when on-boarding or change-boarding users.
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

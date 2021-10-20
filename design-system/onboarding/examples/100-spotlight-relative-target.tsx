/** @jsx jsx */

import { Component } from 'react';

import { css, jsx } from '@emotion/core';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

interface State {
  active: boolean;
}

const relativeDivStyles = css({
  width: '200px',
  height: '200px',
  marginTop: '10px',
  marginLeft: '10px',
  position: 'relative',
  top: '40px',
  left: '40px',
  backgroundColor: 'PaleVioletRed',
  borderRadius: '3px',
  transform: 'translate(10px, 10px)',
});

export default class SpotlightRelativeTarget extends Component<Object, State> {
  state: State = { active: false };

  render() {
    const { active } = this.state;
    return (
      <SpotlightManager>
        <div
          style={{
            backgroundColor: 'wheat',
          }}
        >
          <div style={{ textAlign: 'center', paddingTop: '2em' }}>
            <button
              type="button"
              onClick={() => this.setState({ active: true })}
            >
              Open Spotlight
            </button>
          </div>
          <SpotlightTarget name="box">
            <div css={relativeDivStyles} />
          </SpotlightTarget>
        </div>

        <SpotlightTransition>
          {active && (
            <Spotlight
              actions={[
                {
                  onClick: () => this.setState({ active: false }),
                  text: 'Got it!',
                },
              ]}
              dialogPlacement="bottom left"
              heading="Combination positioning"
              key="box"
              target="box"
              targetRadius={3}
            >
              The spotlight is shown in the correct place despite the target
              being relatively positioned, transformed, and offset by margin.
            </Spotlight>
          )}
        </SpotlightTransition>
      </SpotlightManager>
    );
  }
}

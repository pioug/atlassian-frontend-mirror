import React, { Component } from 'react';
import styled from 'styled-components';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

interface State {
  active: boolean;
}

const RelativeDiv = styled.div`
  background-color: PaleVioletRed;
  border-radius: 3px;
  height: 200px;
  left: 40px;
  margin-left: 10px;
  margin-top: 10px;
  position: relative;
  top: 40px;
  transform: translate(10px, 10px);
  width: 200px;
`;

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
            <button onClick={() => this.setState({ active: true })}>
              Open Spotlight
            </button>
          </div>
          <SpotlightTarget name="box">
            <RelativeDiv />
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

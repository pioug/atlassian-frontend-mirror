import React, { Component } from 'react';
import styled from 'styled-components';
import Lorem from 'react-lorem-component';

import {
  Spotlight,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';
import { Code } from './styled';

import logo from './assets/logo.png';
import logoInverted from './assets/logo-inverted.png';

const radius = 8;
const Replacement = (rect: any) => {
  const style = { borderRadius: radius, overflow: 'hidden', ...rect };

  return (
    <SpotlightPulse style={style}>
      <Image alt="I replace the target element." src={logoInverted} />
    </SpotlightPulse>
  );
};
const Image = styled.img`
  border-radius: ${radius}px;
  height: 128px;
  width: 128px;
`;

interface State {
  active: boolean;
}
/* eslint-disable react/sort-comp */
export default class SpotlightTargetReplacementExample extends Component<
  {},
  State
> {
  state: State = {
    active: false,
  };

  show = () => this.setState({ active: true });

  hide = () => this.setState({ active: false });

  render() {
    const { active } = this.state;

    return (
      <SpotlightManager>
        {/* so we don't get a gross flash on reveal */}
        <img alt="hidden" src={logoInverted} style={{ display: 'none' }} />

        <SpotlightTarget name="target-replacement-example">
          <Image alt="I will be replaced..." src={logo} />
        </SpotlightTarget>

        <p>
          For whatever reason, you may need to show the user something slightly
          different to the original target element. You can achieve this by
          providing a <Code>targetReplacement</Code>, which we pass the
          necessary properties for positioning:
        </p>
        <p>
          <Code>width</Code>, <Code>height</Code>, <Code>top</Code>, and{' '}
          <Code>left</Code>.
        </p>
        <p>
          Import <Code>SpotlightPulse</Code> from this package, and wrap your
          replacement component to achieve the same purple &ldquo;pulse&rdquo;
          animation.
        </p>

        <p>
          <button onClick={this.show}>Show</button>
        </p>

        <SpotlightTransition>
          {active && (
            <Spotlight
              actions={[{ onClick: this.hide, text: 'Done' }]}
              dialogPlacement="bottom left"
              key="target-replacement-example"
              heading="Hey, neat!"
              target="target-replacement-example"
              targetReplacement={Replacement}
            >
              <Lorem count={1} />
            </Spotlight>
          )}
        </SpotlightTransition>
      </SpotlightManager>
    );
  }
}

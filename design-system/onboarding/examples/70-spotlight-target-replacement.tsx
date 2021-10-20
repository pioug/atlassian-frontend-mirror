/** @jsx jsx */
import { Component } from 'react';

import { css, jsx } from '@emotion/core';
import Lorem from 'react-lorem-component';

import { borderRadius as getBorderRadius } from '@atlaskit/theme/constants';

import {
  Spotlight,
  SpotlightManager,
  SpotlightPulse,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

import logoInverted from './assets/logo-inverted.png';
import logo from './assets/logo.png';
import { Code } from './styled';

const borderRadius = getBorderRadius();

const Replacement = (rect: any) => {
  const style = { borderRadius, overflow: 'hidden', ...rect };

  return (
    <SpotlightPulse style={style}>
      <Image alt="I replace the target element." src={logoInverted} />
    </SpotlightPulse>
  );
};

const imageStyles = css({
  width: '128px',
  height: '128px',
  borderRadius: `${borderRadius}px`,
});

const Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  alt,
  ...props
}) => <img {...props} alt={alt} css={imageStyles} />;

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
          <button type="button" onClick={this.show}>
            Show
          </button>
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

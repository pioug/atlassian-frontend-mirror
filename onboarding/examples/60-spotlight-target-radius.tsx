import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

import { Spotlight, SpotlightManager, SpotlightTarget } from '../src';
import { Code, HighlightGroup, Highlight } from './styled';

interface State {
  active: number | null;
}

export default class SpotlightTargetRadiusExample extends Component<{}, State> {
  state: State = { active: null };

  start = () => this.setState({ active: 0 });

  next = () =>
    this.setState(state => ({
      active: state.active != null ? state.active + 1 : null,
    }));

  prev = () =>
    this.setState(state => ({
      active: state.active != null ? state.active - 1 : null,
    }));

  finish = () => this.setState({ active: null });

  renderActiveSpotlight() {
    const variants = [
      <Spotlight
        actions={[
          {
            onClick: this.next,
            text: 'Tell me more',
          },
        ]}
        dialogPlacement="bottom left"
        heading="Small"
        key="small"
        target="small"
        targetRadius={4}
      >
        <Lorem count={1} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom center"
        heading="Medium"
        key="medium"
        target="medium"
        targetRadius={12}
      >
        <Lorem count={1} />
      </Spotlight>,
      <Spotlight
        actions={[{ onClick: this.finish, text: 'Got it' }]}
        dialogPlacement="bottom right"
        heading="Large"
        key="large"
        target="large"
        targetRadius={24}
      >
        <Lorem count={1} />
      </Spotlight>,
    ];

    return this.state.active == null ? null : variants[this.state.active];
  }

  render() {
    return (
      <SpotlightManager>
        <HighlightGroup>
          <SpotlightTarget name="small">
            <Highlight color="blue" radius={4}>
              Small
            </Highlight>
          </SpotlightTarget>
          <SpotlightTarget name="medium">
            <Highlight color="teal" radius={12}>
              Medium
            </Highlight>
          </SpotlightTarget>
          <SpotlightTarget name="large">
            <Highlight color="green" radius={24}>
              Large
            </Highlight>
          </SpotlightTarget>
        </HighlightGroup>

        <p style={{ marginBottom: '1em' }}>
          Rather than digging around in the DOM to find the element applying a
          border-radius, let&apos;s be explicit, define{' '}
          <Code>targetRadius</Code> on the Spotlight to round the cloned
          element.
        </p>

        <button onClick={this.start}>Start</button>

        {this.renderActiveSpotlight()}
      </SpotlightManager>
    );
  }
}

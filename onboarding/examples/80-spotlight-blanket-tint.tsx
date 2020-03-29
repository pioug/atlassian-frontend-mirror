import React, { Component } from 'react';
import Lorem from 'react-lorem-component';

import { Spotlight, SpotlightManager, SpotlightTarget } from '../src';
import { HighlightGroup, Highlight } from './styled';

interface State {
  active: number | null;
}

export default class SpotlightBasicExample extends Component<Object, State> {
  state: State = { active: null };

  start = () => this.setState({ active: 0 });

  next = () => this.setState(state => ({ active: (state.active || 0) + 1 }));

  prev = () => this.setState(state => ({ active: (state.active || 0) - 1 }));

  finish = () => this.setState({ active: null });

  renderActiveSpotlight = () => {
    const variants = [
      <Spotlight
        actions={[
          {
            onClick: this.next,
            text: 'Tell me more',
          },
        ]}
        dialogPlacement="bottom left"
        heading="Green"
        key="green"
        target="green"
      >
        <Lorem count={1} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Prev' },
          { onClick: this.next, text: 'Next' },
        ]}
        dialogPlacement="bottom center"
        heading="Yellow"
        key="yellow"
        target="yellow"
      >
        <Lorem count={1} />
      </Spotlight>,
      <Spotlight
        actions={[{ onClick: this.finish, text: 'Got it' }]}
        dialogPlacement="bottom right"
        heading="Red"
        key="red"
        target="red"
      >
        <Lorem count={1} />
      </Spotlight>,
    ];

    if (this.state.active == null) return null;

    return variants[this.state.active];
  };

  render() {
    return (
      <SpotlightManager blanketIsTinted={false}>
        <HighlightGroup>
          <SpotlightTarget name="green">
            <Highlight color="green">First Element</Highlight>
          </SpotlightTarget>
          <SpotlightTarget name="yellow">
            <Highlight color="yellow">Second Element</Highlight>
          </SpotlightTarget>
          <SpotlightTarget name="red">
            <Highlight color="red">Third Element</Highlight>
          </SpotlightTarget>
        </HighlightGroup>

        <p style={{ marginBottom: '1em' }}>
          Use spotlight to highlight elements in your app to users.
        </p>

        <button onClick={this.start}>Start</button>

        {this.renderActiveSpotlight()}
      </SpotlightManager>
    );
  }
}

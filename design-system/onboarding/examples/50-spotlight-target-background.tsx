import React, { Component } from 'react';
import styled from 'styled-components';
import Lorem from 'react-lorem-component';

import { Spotlight, SpotlightManager, SpotlightTarget } from '../src';
import { Code, Highlight, HighlightGroup } from './styled';

const Wrapper = styled.div`
  background-color: #f6f6f6;
  border-radius: 4px;
  padding: 40px;
`;

interface State {
  active: number | null;
}

/* eslint-disable react/sort-comp */
export default class SpotlightTargetBackgroundExample extends Component<
  Object,
  State
> {
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
            text: 'Moving along',
          },
        ]}
        dialogPlacement="bottom left"
        heading="Eew, gross!"
        key="without"
        target="without"
      >
        <Lorem count={1} />
      </Spotlight>,
      <Spotlight
        actions={[
          { onClick: this.prev, text: 'Back' },
          { onClick: this.finish, text: 'Got it!' },
        ]}
        dialogPlacement="bottom right"
        heading="Aah, that's better!"
        key="with"
        target="with"
        targetBgColor="white"
      >
        <Lorem count={1} />
      </Spotlight>,
    ];

    return this.state.active == null ? null : variants[this.state.active];
  }

  render() {
    return (
      <Wrapper>
        <SpotlightManager>
          <HighlightGroup>
            <SpotlightTarget name="without">
              <Highlight bg="transparent" color="red">
                No Target BG
              </Highlight>
            </SpotlightTarget>
            <SpotlightTarget name="with">
              <Highlight bg="transparent" color="green">
                White Target BG
              </Highlight>
            </SpotlightTarget>
          </HighlightGroup>

          <p style={{ marginBottom: '1em' }}>
            Sometimes your target relies on an ancestor&apos;s background color,
            which is lost when the blanket is applied. Pass any color value to{' '}
            <Code>targetBgColor</Code> to fix this.
          </p>
          <button onClick={this.start}>Start</button>

          {this.renderActiveSpotlight()}
        </SpotlightManager>
      </Wrapper>
    );
  }
}

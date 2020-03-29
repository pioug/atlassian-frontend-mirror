import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';
import { Code, Highlight } from './styled';

type Placement =
  | 'top right'
  | 'top center'
  | 'top left'
  | 'right bottom'
  | 'right middle'
  | 'right top'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right'
  | 'left top'
  | 'left middle'
  | 'left bottom';

const options = [
  'top right',
  'top center',
  'top left',
  'right bottom',
  'right middle',
  'right top',
  'bottom left',
  'bottom center',
  'bottom right',
  'left top',
  'left middle',
  'left bottom',
];

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

interface State {
  index?: number;
}

/* eslint-disable react/sort-comp */
export default class SpotlightDialogPlacementExample extends Component<
  {},
  State
> {
  state: State = {};

  next = () => this.setState(state => ({ index: (state.index || 0) + 1 }));

  start = () => this.setState({ index: 0 });

  finish = () => this.setState({ index: undefined });

  render() {
    const { index } = this.state;
    const placement = isNaN(index as number)
      ? null
      : options[(index || 0) % options.length];

    return (
      <Wrapper>
        <SpotlightManager>
          <SpotlightTarget name="placement-example">
            <Highlight color="neutral">Target</Highlight>
          </SpotlightTarget>

          <p>Click the target to change the dialog&apos;s placement.</p>
          <p>
            Achieved by passing our handler to the <Code>targetOnClick</Code>{' '}
            property.
          </p>
          <p>
            <Button testId="open-spotlight" onClick={this.start}>
              Show
            </Button>
          </p>

          <SpotlightTransition>
            {placement ? (
              <Spotlight
                actions={[{ onClick: this.finish, text: 'Done' }]}
                dialogPlacement={placement as Placement}
                dialogWidth={300}
                heading={`"${placement}"`}
                key="placement-example"
                target="placement-example"
                targetOnClick={this.next}
              >
                A single line of innocuous text.
              </Spotlight>
            ) : null}
          </SpotlightTransition>
        </SpotlightManager>
      </Wrapper>
    );
  }
}

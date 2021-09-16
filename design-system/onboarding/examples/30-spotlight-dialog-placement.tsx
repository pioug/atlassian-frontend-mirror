/** @jsx jsx */
import { Component } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/custom-theme-button';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import {
  Spotlight,
  SpotlightManager,
  SpotlightTarget,
  SpotlightTransition,
} from '../src';

import { Code, Highlight } from './styled';

type Placement = typeof options[number];

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
] as const;

const wrapperStyles = css({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

interface State {
  index?: number;
}

/* eslint-disable react/sort-comp */
export default class SpotlightDialogPlacementExample extends Component<
  {},
  State
> {
  state: State = {};

  next = () => this.setState((state) => ({ index: (state.index || 0) + 1 }));

  start = () => this.setState({ index: 0 });

  finish = () => this.setState({ index: undefined });

  render() {
    const { index } = this.state;
    const placement = isNaN(index as number)
      ? null
      : options[(index || 0) % options.length];

    return (
      <div css={wrapperStyles}>
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
                headingAfterElement={
                  <Button
                    onClick={this.finish}
                    iconBefore={<CrossIcon label="Close" />}
                    appearance="subtle"
                  />
                }
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
      </div>
    );
  }
}

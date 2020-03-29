import React, { Component, ReactNode } from 'react';
import Button from '@atlaskit/button';
import InfoIcon from '@atlaskit/icon/glyph/info';
import { gridSize } from '@atlaskit/theme';
import Flag, { FlagGroup } from '../src';

type State = {
  flags: Array<ReactNode>;
};

export default class ProgrammaticFlagDismissExample extends Component<
  void,
  State
> {
  state = {
    flags: [
      <Flag
        id="flag1"
        key="flag1"
        title="Can I leave yet?"
        description="Dismiss me by clicking the button on the page"
        icon={<InfoIcon label="Info" />}
      />,
    ],
  };

  dismissFlag = () => {
    this.setState({ flags: [] });
  };

  render() {
    return (
      <div>
        <p style={{ padding: `${gridSize() * 2}px` }}>
          <Button appearance="primary" onClick={this.dismissFlag}>
            Dismiss the Flag
          </Button>
        </p>
        <FlagGroup>{this.state.flags}</FlagGroup>
      </div>
    );
  }
}

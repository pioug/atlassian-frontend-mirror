import React, { Component } from 'react';

import Button from '@atlaskit/button/new';

import InlineDialog from '../src';

interface State {
  dialogOpen: boolean;
}

const content = (
  <div>
    <p>Hello!</p>
  </div>
);

export default class InlineDialogDefaultExample extends Component<{}, State> {
  state = {
    dialogOpen: true,
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    return (
      <div style={{ minHeight: '120px' }} data-testid="inline-dialog">
        <InlineDialog
          onClose={() => {
            this.setState({ dialogOpen: false });
          }}
          content={content}
          isOpen={this.state.dialogOpen}
        >
          <Button
            isSelected={this.state.dialogOpen}
            onClick={this.toggleDialog}
          >
            Click me!
          </Button>
        </InlineDialog>
      </div>
    );
  }
}

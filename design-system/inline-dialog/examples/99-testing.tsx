import React, { Component } from 'react';

import Button from '@atlaskit/button/standard-button';

import InlineDialog from '../src';

interface State {
  dialogOpen: boolean;
}

const content = (
  <div>
    <p>Hello!</p>
  </div>
);

export default class InlineDialogTestingExample extends Component<{}, State> {
  state = {
    dialogOpen: false,
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    return (
      <div style={{ minHeight: '120px' }}>
        <InlineDialog
          onClose={() => {
            this.setState({ dialogOpen: false });
          }}
          content={content}
          isOpen={this.state.dialogOpen}
          testId="inline-dialog"
        >
          <Button
            isSelected={this.state.dialogOpen}
            onClick={this.toggleDialog}
            testId="open-inline-dialog-button"
          >
            Click me!
          </Button>
        </InlineDialog>
      </div>
    );
  }
}

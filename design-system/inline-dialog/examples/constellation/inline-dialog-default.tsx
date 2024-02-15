import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { Box, xcss } from '@atlaskit/primitives';

import InlineDialog from '../../src';

const containerStyles = xcss({
  minHeight: '120px',
});

interface State {
  dialogOpen: boolean;
}

const content = (
  <Box>
    <p>Hello!</p>
  </Box>
);

export default class InlineDialogDefaultExample extends Component<{}, State> {
  state = {
    dialogOpen: true,
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    return (
      <Box xcss={containerStyles}>
        <InlineDialog
          onClose={() => {
            this.setState({ dialogOpen: false });
          }}
          content={content}
          isOpen={this.state.dialogOpen}
        >
          <Button
            appearance="primary"
            isSelected={this.state.dialogOpen}
            onClick={this.toggleDialog}
          >
            Click me!
          </Button>
        </InlineDialog>
      </Box>
    );
  }
}

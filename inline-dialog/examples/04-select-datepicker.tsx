import React, { Component } from 'react';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import { DatePicker } from '@atlaskit/datetime-picker';
import InlineDialog from '../src';

interface State {
  isDialogOpen: boolean;
}

export default class SingleSelectDialog extends Component<{}, State> {
  state = {
    isDialogOpen: true,
  };

  openDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  dialogClosed = () => {
    this.setState(prevState => ({ isDialogOpen: !prevState.isDialogOpen }));
  };

  render() {
    const options = [
      {
        label: 'value 1',
        value: 1,
      },
      {
        label: 'value 2',
        value: 2,
      },
    ];

    const content = (
      <div style={{ width: '300px' }}>
        <p>
          <Select options={options} />
        </p>
        <p>
          <DatePicker />
        </p>
      </div>
    );

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div>
          <InlineDialog
            content={content}
            isOpen={this.state.isDialogOpen}
            onClose={this.dialogClosed}
          >
            <Button
              onClick={this.openDialog}
              isDisabled={this.state.isDialogOpen}
            >
              Open Dialog
            </Button>
          </InlineDialog>
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';

import Button from '@atlaskit/button/new';
import { DatePicker } from '@atlaskit/datetime-picker';
import Select from '@atlaskit/select';

import InlineDialog from '../src';

interface State {
  isDialogOpen: boolean;
}

export default class InlineDialogDatepickerExample extends Component<
  {},
  State
> {
  state = {
    isDialogOpen: true,
  };

  openDialog = () => {
    this.setState({ isDialogOpen: true });
  };

  dialogClosed = () => {
    this.setState((prevState) => ({ isDialogOpen: !prevState.isDialogOpen }));
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
        <div>
          <label htmlFor="select">Select</label>
          <Select
            inputId="select"
            options={options}
            classNamePrefix="react-select"
          />
        </div>
        <div>
          <label htmlFor="datepicker">Date picker</label>
          <DatePicker id="datepicker" testId="date-picker" />
        </div>
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
            testId="inline-dialog"
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

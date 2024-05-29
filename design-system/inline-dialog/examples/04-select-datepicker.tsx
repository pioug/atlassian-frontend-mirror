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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          alignItems: 'center',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          height: '100%',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          justifyContent: 'center',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
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

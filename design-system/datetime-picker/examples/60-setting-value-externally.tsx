import React, { Component } from 'react';

import { Label } from '@atlaskit/field-base';
import TextField from '@atlaskit/textfield';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

interface State {
  datePickerValue: string;
  timePickerValue: string;
  dateTimePickerValue: string;
}

export default class MyComponent extends Component<{}, State> {
  state = {
    datePickerValue: '2018-01-02',
    timePickerValue: '14:30',
    dateTimePickerValue: '2018-01-02T14:30+11:00',
  };

  onDatePickerChange = (e: any) => {
    this.setState({
      datePickerValue: e.target.value,
    });
  };

  onTimePickerChange = (e: any) => {
    this.setState({
      timePickerValue: e.target.value,
    });
  };

  onDateTimePickerChange = (e: any) => {
    this.setState({
      dateTimePickerValue: e.target.value,
    });
  };

  render() {
    const {
      datePickerValue,
      timePickerValue,
      dateTimePickerValue,
    } = this.state;

    return (
      <div>
        <p>
          This demonstrates updating each pickers value via an external source.
        </p>
        <h3>Date picker</h3>
        <Label label="Input" htmlFor="date-picker-override" />
        <TextField
          id="date-picker-override"
          value={datePickerValue}
          onChange={this.onDatePickerChange}
        />

        <Label label="Date" htmlFor="date-picker" />
        <DatePicker
          id="date-picker"
          value={datePickerValue}
          isDisabled
          onChange={console.log}
        />

        <h3>Time picker</h3>
        <Label label="Input" htmlFor="time-picker-override" />
        <TextField
          id="time-picker-override"
          value={timePickerValue}
          onChange={this.onTimePickerChange}
        />

        <Label label="Date" htmlFor="time-picker" />
        <TimePicker
          id="time-picker"
          value={timePickerValue}
          isDisabled
          onChange={console.log}
        />

        <h3>Date / time picker</h3>
        <Label label="Input" htmlFor="datetime-picker-override" />
        <TextField
          id="datetime-picker-override"
          label="Input"
          value={dateTimePickerValue}
          onChange={this.onDateTimePickerChange}
        />

        <Label label="Date" htmlFor="datetime-picker" />
        <DateTimePicker
          id="datetime-picker"
          value={dateTimePickerValue}
          isDisabled
          onChange={console.log}
        />
      </div>
    );
  }
}

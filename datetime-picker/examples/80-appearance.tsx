import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label label="TimePicker - default no icon" />
      <TimePicker onChange={console.log} />

      <Label label="TimePicker - subtle appearance" />
      <TimePicker onChange={console.log} appearance="subtle" />
      <Label label="TimePicker - compact spacing" />
      <TimePicker onChange={console.log} spacing="compact" />

      <Label label="DatePicker - default" />
      <DatePicker onChange={console.log} />
      <Label label="DatePicker - hideIcon" />
      <DatePicker onChange={console.log} hideIcon />
      <Label label="DatePicker - subtle appearance" />
      <DatePicker onChange={console.log} appearance="subtle" />
      <Label label="DatePicker - compact spacing" />
      <DatePicker onChange={console.log} spacing="compact" />

      <Label label="DateTimePicker - default" />
      <DateTimePicker onChange={console.log} />
      <Label label="DateTimePicker - hideIcon" />
      <DateTimePicker onChange={console.log} hideIcon />
      <Label label="DateTimePicker - subtle appearance" />
      <DateTimePicker onChange={console.log} appearance="subtle" />
      <Label label="DateTimePicker - compact spacing" />
      <DateTimePicker onChange={console.log} spacing="compact" />
    </div>
  );
};

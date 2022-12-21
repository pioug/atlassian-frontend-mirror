import React from 'react';

import { Label } from '@atlaskit/form';

import { DatePicker, DateTimePicker, TimePicker } from '../src';

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-time-default-no-icon--input">
        TimePicker - default
      </Label>
      <TimePicker id="time-default-no-icon" onChange={console.log} />
      <Label htmlFor="react-select-time-hide-icon--input">
        TimePicker - hide clear indicator icon
      </Label>
      <TimePicker id="date-hide-icon" onChange={console.log} hideIcon />
      <Label htmlFor="react-select-time-subtle--input">
        TimePicker - subtle appearance
      </Label>
      <TimePicker id="time-subtle" onChange={console.log} appearance="subtle" />
      <Label htmlFor="react-select-time-subtle--input">
        TimePicker - subtle appearance, disabled
      </Label>
      <TimePicker
        id="time-subtle"
        onChange={console.log}
        appearance="subtle"
        isDisabled
      />
      <Label htmlFor="react-select-time-no-appearance--input">
        TimePicker - 'none' appearance
      </Label>
      <TimePicker id="time-none" onChange={console.log} appearance="none" />
      <Label htmlFor="react-select-time-no-appearance--input">
        TimePicker - 'none' appearance, disabled
      </Label>
      <TimePicker
        id="time-none"
        onChange={console.log}
        appearance="none"
        isDisabled
      />
      <Label htmlFor="react-select-time-compact--input">
        TimePicker - compact spacing
      </Label>
      <TimePicker id="time-compact" onChange={console.log} spacing="compact" />

      <br />

      <Label htmlFor="react-select-date-default--input">
        DatePicker - default
      </Label>
      <DatePicker id="date-default" onChange={console.log} />
      <Label htmlFor="react-select-date-hide-icon--input">
        DatePicker - hideIcon
      </Label>
      <DatePicker id="date-hide-icon" onChange={console.log} hideIcon />
      <Label htmlFor="react-select-date-subtle--input">
        DatePicker - subtle appearance
      </Label>
      <DatePicker id="date-subtle" onChange={console.log} appearance="subtle" />
      <Label htmlFor="react-select-date-no-appearance--input">
        DatePicker - 'none' appearance
      </Label>
      <DatePicker id="date-none" onChange={console.log} appearance="none" />
      <Label htmlFor="react-select-date-compact--input">
        DatePicker - compact spacing
      </Label>
      <DatePicker id="date-compact" onChange={console.log} spacing="compact" />

      <br />

      <Label htmlFor="react-select-datetime-default--input">
        DateTimePicker - default
      </Label>
      <DateTimePicker id="datetime-default" onChange={console.log} />
      <Label htmlFor="react-select-datetime-subtle--input">
        DateTimePicker - subtle appearance
      </Label>
      <DateTimePicker
        id="datetime-subtle"
        onChange={console.log}
        appearance="subtle"
      />
      <Label htmlFor="react-select-datetime-no-appearance--input">
        DateTimePicker - 'none' appearance
      </Label>
      <DateTimePicker
        id="datetime-none"
        onChange={console.log}
        appearance="none"
      />
      <Label htmlFor="react-select-datetime-compact--input">
        DateTimePicker - compact spacing
      </Label>
      <DateTimePicker
        id="datetime-compact"
        onChange={console.log}
        spacing="compact"
      />
    </div>
  );
};

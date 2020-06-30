import React, { useState } from 'react';

import moment from 'moment';

import { Label } from '@atlaskit/field-base';

import { DateTimePicker } from '../src';

export default () => {
  const [value, setValue] = useState('2020-06-02T09:30+1000');
  const [invalid, setInvalid] = useState(false);

  const onChange = (value: string) => {
    setValue(value);
    setInvalid(!moment(value).isValid());
  };

  return (
    <div>
      <Label label={`Current time is: ${value}`} />
      <DateTimePicker
        value={value}
        onChange={onChange}
        timeIsEditable
        isInvalid={invalid}
      />
    </div>
  );
};

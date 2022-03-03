import React from 'react';

import moment from 'moment';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../src';

const parseInputValue = (date: string, dateFormat: string) => {
  return moment(date, dateFormat).toDate();
};

export default () => {
  return (
    <div>
      <Label htmlFor="react-select-custom-parser--input">
        Custom date format and parseInputValue prop
      </Label>
      <DatePicker
        id="custom-parser"
        dateFormat="DD/MM/YY"
        parseInputValue={parseInputValue}
        selectProps={{
          placeholder: 'e.g. 31/Dec/18',
        }}
        onChange={console.log}
      />
    </div>
  );
};

import React from 'react';

// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';

import { Label } from '@atlaskit/form';

import { DatePicker } from '../src';

function getRelativeDate(daysAfter: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysAfter);
  // date-fns version 2 uses a new formatting system
  return date.toISOString();
}

// In this example, range can't be earlier than 30 days ago, and can't be on weekends
const earliestDateString = getRelativeDate(-30);
const latestDateString = getRelativeDate(0);

const weekendFilter = (date: string) => {
  const dayOfWeek = parseISO(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

export default () => {
  const [startDate, setStartDate] = React.useState<string>(
    getRelativeDate(-14),
  );
  const [endDate, setEndDate] = React.useState<string>(getRelativeDate(0));

  return (
    <div>
      <h3> Export Data </h3>
      <Label htmlFor="react-select-start-date--input">
        Start date (past 30 days)
      </Label>
      <DatePicker
        id="start-date"
        onChange={(date) => setStartDate(date)}
        value={startDate}
        minDate={earliestDateString}
        maxDate={endDate || latestDateString}
        disabledDateFilter={weekendFilter}
        testId={'datePicker'}
      />

      <Label htmlFor="react-select-end-date--input">End date</Label>
      <DatePicker
        id="end-date"
        value={endDate}
        minDate={startDate || earliestDateString}
        maxDate={latestDateString}
        disabledDateFilter={weekendFilter}
        onChange={(date) => setEndDate(date)}
      />
    </div>
  );
};

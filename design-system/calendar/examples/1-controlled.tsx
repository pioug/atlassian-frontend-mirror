import React, { useCallback, useReducer } from 'react';

import Calendar from '../src';
import type { DateObj } from '../src/internal/types';

const log = (msg: string) => (e: any) => console.log(msg, e);

const reducer = (
  prevState: State,
  updatedProperty: {
    [P in keyof State]?: State[P];
  },
) => ({
  ...prevState,
  ...updatedProperty,
});

interface State {
  disabled: string[];
  previouslySelected: string[];
  selected: string[];
  day: number;
  month: number;
  year: number;
}

export default () => {
  const [state, setState] = useReducer(reducer, {
    disabled: ['2020-12-04'],
    previouslySelected: ['2020-12-06'],
    selected: ['2020-12-08'],
    day: 1,
    month: 12,
    year: 2020,
  });

  const handleSelect = useCallback(
    (selectedDate: { iso: string }) => {
      setState({
        previouslySelected: state.selected,
        selected: [selectedDate.iso],
      });
    },
    [state.selected],
  );

  const handleChange = useCallback((changedDate: DateObj) => {
    const { day, month, year } = changedDate;
    setState({
      day,
      month,
      year,
    });
  }, []);

  return (
    <Calendar
      disabled={state.disabled}
      previouslySelected={state.previouslySelected}
      selected={state.selected}
      day={state.day}
      month={state.month}
      year={state.year}
      innerProps={{
        style: {
          border: '1px solid red',
          display: 'inline-block',
        },
      }}
      onBlur={() => log('blur')}
      onChange={handleChange}
      onFocus={() => log('focus')}
      onSelect={handleSelect}
      testId="test"
    />
  );
};

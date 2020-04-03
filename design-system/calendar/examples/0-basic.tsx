import React from 'react';
import Calendar from '../src';

const log = (msg: string) => (e: any) => console.log(msg, e);

export default () => (
  <Calendar
    defaultDisabled={['2020-12-04']}
    defaultPreviouslySelected={['2020-12-06']}
    defaultSelected={['2020-12-08']}
    defaultMonth={12}
    defaultYear={2020}
    innerProps={{
      style: {
        border: '1px solid red',
        display: 'inline-block',
      },
    }}
    onBlur={() => log('blur')}
    onChange={() => log('change')}
    onFocus={() => log('focus')}
    onSelect={() => log('select')}
    testId={'calendar'}
  />
);

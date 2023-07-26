import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DatePickerDefault from '../../../../examples/constellation/date-picker-default';
import DateTimePickerDefault from '../../../../examples/constellation/datetime-picker-default';
import TimePickerDefault from '../../../../examples/constellation/time-picker-default';

it('Default date time picker should pass axe audit', async () => {
  const { container } = render(<DateTimePickerDefault />);
  await axe(container);
});

it('Default date picker should pass axe audit', async () => {
  const { container } = render(<DatePickerDefault />);
  await axe(container);
});

it('Default time picker should pass axe audit', async () => {
  const { container } = render(<TimePickerDefault />);
  await axe(container);
});

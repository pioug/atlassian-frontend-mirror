import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import DateTimePickerDefaultExample from '../../../../examples/constellation/datetime-picker-default';

it('Default date time picker should pass axe audit', async () => {
  const { container } = render(<DateTimePickerDefaultExample />);
  await axe(container);
});

import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Calendar from '../../index';

// This contains one violation related to the week-header component. Because
// all the children are using `aria-hidden` but the parent has a `row` role,
// there are effectively no children for the row. The week-header should have
// `aria-hidden`, but because it currently uses the Grid primitive, that is not
// available at the moment. (DSP-12638)
it.skip('Calendar should pass an aXe audit', async () => {
  const { container } = render(<Calendar />);
  await axe(container);
});

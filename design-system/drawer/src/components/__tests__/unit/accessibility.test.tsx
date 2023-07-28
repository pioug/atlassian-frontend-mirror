import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicDrawer from '../../../../examples/constellation/drawer-default';

it('Basic drawer should pass axe audit', async () => {
  const { container, getByText, getByLabelText } = render(<BasicDrawer />);
  fireEvent.click(getByText('Open drawer'));
  expect(getByLabelText('Close drawer')).toBeInTheDocument();
  await axe(container);
});

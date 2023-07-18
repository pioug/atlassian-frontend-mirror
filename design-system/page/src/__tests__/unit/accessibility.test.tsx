import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Page from '../../../examples/00-basic-usage';

it('Basic Page should not fail aXe audit', async () => {
  const { container } = render(<Page />);
  await axe(container);
});

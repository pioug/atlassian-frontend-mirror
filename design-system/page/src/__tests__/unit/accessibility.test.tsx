import React from 'react';

import { render } from '@testing-library/react';

import {
  axe,
  jestAxeConfig,
  toHaveNoViolations,
} from '@af/accessibility-testing';

import Page from '../../../examples/00-basic-usage';

expect.extend(toHaveNoViolations);

it('Basic Page should not fail aXe audit', async () => {
  const { container } = render(<Page />);
  const results = await axe(container, jestAxeConfig);
  expect(results).toHaveNoViolations();
});

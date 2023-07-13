import React from 'react';

import { render } from '@testing-library/react';

import {
  axe,
  jestAxeConfig,
  toHaveNoViolations,
} from '@af/accessibility-testing';

import Spinner from '../../spinner';

expect.extend(toHaveNoViolations);

it('Basic Spinner should not fail aXe audit', async () => {
  const { container } = render(<Spinner interactionName="load" />);
  const results = await axe(container, jestAxeConfig);
  expect(results).toHaveNoViolations();
});

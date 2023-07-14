import React from 'react';

import { cleanup, render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import NestedSideNav from '../../../examples/00-nested-side-navigation';
import RBDSideNav from '../../../examples/01-sidebar-with-rbd';

expect.extend(toHaveNoViolations);

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
const axeRules: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
};

it('Basic Nested side nav example should not fail an aXe audit', async () => {
  const { container } = render(<NestedSideNav />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('RBD pattern should not fail an aXe audit', async () => {
  const { container } = render(<RBDSideNav />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

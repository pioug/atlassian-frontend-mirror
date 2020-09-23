import React from 'react';

import { cleanup, render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import PopupExample from '../../../examples/10-popup';

expect.extend(toHaveNoViolations);

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
const axeRules: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
};

it('popup should not fail an aXe audit', async () => {
  const { container } = render(<PopupExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

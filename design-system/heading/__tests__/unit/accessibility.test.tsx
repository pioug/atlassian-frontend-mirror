import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Heading from '../../src/heading';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic Heading should not fail aXe audit', async () => {
  const { container } = render(
    <Heading level="h900" color="inverse">
      inverse
    </Heading>,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import ProgressIndicator from '../../progress-dots';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic ProgressIndicator should not fail aXe audit', async () => {
  const { container } = render(
    <ProgressIndicator
      selectedIndex={0}
      values={['one', 'two', 'three']}
      size="default"
    />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

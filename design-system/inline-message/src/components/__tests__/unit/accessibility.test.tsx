import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import InlineMessage from '../../inline-message';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic InlineMessage should not fail aXe audit', async () => {
  const { container } = render(
    <InlineMessage
      title="Inline Message Title Example"
      secondaryText="Secondary Text"
    >
      <p>Primary and secondary text dialog</p>
    </InlineMessage>,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Button from '@atlaskit/button';

import Tooltip from '../../Tooltip';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic Tooltip should not fail aXe audit', async () => {
  const { container } = render(
    <Tooltip content="Hello World">
      {(tooltipProps) => <Button {...tooltipProps}>Hover Over Me</Button>}
    </Tooltip>,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

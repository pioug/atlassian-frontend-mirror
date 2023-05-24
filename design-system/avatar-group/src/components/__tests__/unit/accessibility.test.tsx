import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import BasicAvatarGroupExample from '../../../../examples/02-basic-avatar-group';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic AvatarGroup example (stack, grid) should not fail aXe audit', async () => {
  const { container } = render(<BasicAvatarGroupExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

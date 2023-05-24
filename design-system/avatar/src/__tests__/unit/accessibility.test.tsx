import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import BasicAvatarExample from '../../../examples/01-basicAvatar';
import AvatarItemExample from '../../../examples/03-basicAvatarItem';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic Avatar examples (circle, square, disabled, with presence, with status) should not fail aXe audit', async () => {
  const { container } = render(<BasicAvatarExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Avatar Item examples should not fail aXe audit', async () => {
  const { container } = render(<AvatarItemExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

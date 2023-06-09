import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Image from '@atlaskit/image';

import Cat from '../../examples/images/cat.png';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic Image should not fail aXe audit', async () => {
  const { container } = render(<Image src={Cat} alt="Simple example" />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Should fail without alt attribute aXe audit', async () => {
  const { container } = render(<Image src={Cat} alt={undefined} />);
  const results = await axe(container, axeRules);
  expect(() => expect(results).toHaveNoViolations()).toThrow(
    'Images must have alternate text (image-alt)',
  );
});

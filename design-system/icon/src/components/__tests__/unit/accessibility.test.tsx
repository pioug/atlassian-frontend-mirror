import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import LikeIcon from '../../../../glyph/like';
import CustomIconExample from '../../../../examples/constellation/custom-icon-default';
import CustomSvgExample from '../../../../examples/constellation/custom-svg-default';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic icon with empty label string should not fail aXe audit', async () => {
  const { container } = render(<LikeIcon label="" />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Basic icon with label string should not fail aXe audit', async () => {
  const { container } = render(<LikeIcon label="Like" />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Custom icon should not fail aXe audit', async () => {
  const { container } = render(<CustomIconExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Custom SVG should not fail aXe audit', async () => {
  const { container } = render(<CustomSvgExample />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

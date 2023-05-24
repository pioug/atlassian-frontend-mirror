import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import BasicBreadcrumbsExample from '../../../../examples/0-basic';
import LongBreadcrumbsExample from '../../../../examples/1-long';
import WithOnClickNoHrefBreadcrumbsExample from '../../../../examples/10-with-on-click-no-href';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

it('Basic Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<BasicBreadcrumbsExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('Long (with ellipsis truncation) Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<LongBreadcrumbsExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

it('With onClick and no href Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<WithOnClickNoHrefBreadcrumbsExample />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
});

import React from 'react';

import { cleanup, render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import ButtonItem from '../../../examples/button-item';
import HeadingItem from '../../../examples/heading-item';
import LinkItem from '../../../examples/link-item';
import LoadingSkeletonMenu from '../../../examples/loading-skeleton';
import ScrollableSectionMenu from '../../../examples/scrollable-sections';

expect.extend(toHaveNoViolations);

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
const axeRules: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
};

it('button item pattern should not fail an aXe audit', async () => {
  const { container } = render(<ButtonItem />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('link item should not fail an aXe audit', async () => {
  const { container } = render(<LinkItem />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('heading item should not fail an aXe audit', async () => {
  const { container } = render(<HeadingItem />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Complex menu should not fail an aXe audit', async () => {
  const { container } = render(<ScrollableSectionMenu />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Loading Skeleton should not fail an aXe audit', async () => {
  const { container } = render(<LoadingSkeletonMenu />);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

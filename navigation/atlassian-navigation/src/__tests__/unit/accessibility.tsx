import React from 'react';

import { cleanup, render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import AuthNav from '../../../examples/10-authenticated-example';
import AnonymousNav from '../../../examples/20-anonymous-example';
import { NavigationSkeleton } from '../../components/AtlassianNavigation/skeleton';

expect.extend(toHaveNoViolations);

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
const axeRules: JestAxeConfigureOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
  resultTypes: ['violations', 'incomplete'],
};

it('Standard authenticated nav elements should not fail an aXe audit', async () => {
  const { container } = render(<AuthNav />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Standard anonymous nav elements should not fail an aXe audit', async () => {
  const { container } = render(<AnonymousNav />);
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Overflow menu should not fail an aXe audit', async () => {
  const { container } = render(
    <div style={{ width: '100px' }}>
      <AnonymousNav />
    </div>,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

it('Skeleton should not fail an aXe audit', async () => {
  const { container } = render(
    <NavigationSkeleton primaryItemsCount={3} secondaryItemsCount={4} />,
  );
  const results = await axe(container, axeRules);
  expect(results).toHaveNoViolations();
  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
  cleanup();
});

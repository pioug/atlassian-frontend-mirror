import React from 'react';

import { render } from '@testing-library/react';
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe';

import Badge from '../../../src';

expect.extend(toHaveNoViolations);

const axeRules: JestAxeConfigureOptions = {
  rules: {
    // As we're testing on the JSDOM, color-contrast testing can't run.
    'color-contrast': { enabled: false },
  },
  // The types of results fetched are limited for performance reasons
  resultTypes: ['violations', 'incomplete', 'inapplicable'],
};

// Basic tests

it('Basic badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge>{123}</Badge>);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Primary badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="primary">{123}</Badge>);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Primary inverted badge should not fail basic aXe audit', async () => {
  const { container } = render(
    <Badge appearance="primaryInverted">{123}</Badge>,
  );
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Important badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="important">{123}</Badge>);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Added badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="added">+100</Badge>);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Removed badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="removed">+100</Badge>);
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

// Interaction tests

it('Badge with max value should not fail an aXe audit', async () => {
  const { container } = render(
    <Badge appearance="added" max={500}>
      {1000}
    </Badge>,
  );
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

it('Disabled badge should not fail an aXe audit', async () => {
  const { container } = render(
    <Badge appearance="added" max={false}>
      {1000}
    </Badge>,
  );
  const results = await axe(container, axeRules);

  expect(results).toHaveNoViolations();
});

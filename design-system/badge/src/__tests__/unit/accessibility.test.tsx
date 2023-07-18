import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Badge from '../../../src';

// Basic tests

it('Basic badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge>{123}</Badge>);
  await axe(container);
});

it('Primary badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="primary">{123}</Badge>);
  await axe(container);
});

it('Primary inverted badge should not fail basic aXe audit', async () => {
  const { container } = render(
    <Badge appearance="primaryInverted">{123}</Badge>,
  );
  await axe(container);
});

it('Important badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="important">{123}</Badge>);
  await axe(container);
});

it('Added badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="added">+100</Badge>);
  await axe(container);
});

it('Removed badge should not fail basic aXe audit', async () => {
  const { container } = render(<Badge appearance="removed">+100</Badge>);
  await axe(container);
});

// Interaction tests

it('Badge with max value should not fail an aXe audit', async () => {
  const { container } = render(
    <Badge appearance="added" max={500}>
      {1000}
    </Badge>,
  );
  await axe(container);
});

it('Disabled badge should not fail an aXe audit', async () => {
  const { container } = render(
    <Badge appearance="added" max={false}>
      {1000}
    </Badge>,
  );
  await axe(container);
});

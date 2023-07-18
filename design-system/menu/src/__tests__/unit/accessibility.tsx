import React from 'react';

import { cleanup, render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import ComposedMenuGroupExample from '../../../examples/05-menu-group';
import ButtonItemExample from '../../../examples/button-item';
import CustomItemExample from '../../../examples/custom-item';
import HeadingItemExample from '../../../examples/heading-item';
import LinkItemExample from '../../../examples/link-item';
import LoadingSkeletonMenuExample from '../../../examples/loading-skeleton';
import ScrollableSectionMenuExample from '../../../examples/scrollable-sections';

// As we're testing on the JSDOM, color-contrast testing can't run.
// The types of results fetched are limited for performance reasons
afterEach(() => {
  cleanup();
});

it('button item pattern should not fail an aXe audit', async () => {
  const { container } = render(<ButtonItemExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

it('link item should not fail an aXe audit', async () => {
  const { container } = render(<LinkItemExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

it('heading item should not fail an aXe audit', async () => {
  const { container } = render(<HeadingItemExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

it('custom item should not fail an aXe audit', async () => {
  const { container } = render(<CustomItemExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

it('Complex menu should not fail an aXe audit', async () => {
  const { container } = render(<ScrollableSectionMenuExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

it('Loading Skeleton should not fail an aXe audit', async () => {
  const { container } = render(<LoadingSkeletonMenuExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

it('Composed Menu Group examples should not fail an aXe audit', async () => {
  const { container } = render(<ComposedMenuGroupExample />);
  const results = await axe(container);

  // Only tests we explicitly skip can be incomplete
  expect(results.incomplete).toHaveLength(0);
});

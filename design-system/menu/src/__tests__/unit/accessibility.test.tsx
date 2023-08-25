import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import ComposedMenuGroupExample from '../../../examples/05-menu-group';
import ButtonItemExample from '../../../examples/button-item';
import CustomItemExample from '../../../examples/custom-item';
import HeadingItemExample from '../../../examples/heading-item';
import LinkItemExample from '../../../examples/link-item';
import LoadingSkeletonMenuExample from '../../../examples/loading-skeleton';
import ScrollableSectionMenuExample from '../../../examples/scrollable-sections';

it('button item pattern should not fail an aXe audit', async () => {
  const { container } = render(<ButtonItemExample />);
  await axe(container);
});

it('link item should not fail an aXe audit', async () => {
  const { container } = render(<LinkItemExample />);
  await axe(container);
});

it('heading item should not fail an aXe audit', async () => {
  const { container } = render(<HeadingItemExample />);
  await axe(container);
});

it('custom item should not fail an aXe audit', async () => {
  const { container } = render(<CustomItemExample />);
  await axe(container);
});

it('Complex menu should not fail an aXe audit', async () => {
  const { container } = render(<ScrollableSectionMenuExample />);
  await axe(container);
});

it('Loading Skeleton should not fail an aXe audit', async () => {
  const { container } = render(<LoadingSkeletonMenuExample />);
  await axe(container);
});

it('Composed Menu Group examples should not fail an aXe audit', async () => {
  const { container } = render(<ComposedMenuGroupExample />);
  await axe(container);
});

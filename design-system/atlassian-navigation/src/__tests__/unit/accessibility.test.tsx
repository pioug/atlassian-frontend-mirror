import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import AuthNav from '../../../examples/10-authenticated-example';
import AnonymousNav from '../../../examples/20-anonymous-example';
import { NavigationSkeleton } from '../../components/AtlassianNavigation/skeleton';

it('Standard authenticated nav elements should not fail an aXe audit', async () => {
  const { container } = render(<AuthNav />);
  await axe(container);
});

it('Standard anonymous nav elements should not fail an aXe audit', async () => {
  const { container } = render(<AnonymousNav />);
  await axe(container);
});

it('Overflow menu should not fail an aXe audit', async () => {
  const { container } = render(
    <div style={{ width: '100px' }}>
      <AnonymousNav />
    </div>,
  );
  await axe(container);
});

it('Skeleton should not fail an aXe audit', async () => {
  const { container } = render(
    <NavigationSkeleton primaryItemsCount={3} secondaryItemsCount={4} />,
  );
  await axe(container);
});

import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import { SpotlightCard } from '../../index';

// Basic test
it('SpotlightCard should not fail basic aXe audit', async () => {
  const { container } = render(
    <SpotlightCard>This is a basic spotlight card</SpotlightCard>,
  );
  await axe(container);
});

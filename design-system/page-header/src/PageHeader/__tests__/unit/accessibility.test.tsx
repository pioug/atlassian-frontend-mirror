import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import PageHeader from '../../index';

// Basic test
it('PageHeader should not fail basic aXe audit', async () => {
  const { container } = render(
    <PageHeader>This is the page header</PageHeader>,
  );
  await axe(container);
});

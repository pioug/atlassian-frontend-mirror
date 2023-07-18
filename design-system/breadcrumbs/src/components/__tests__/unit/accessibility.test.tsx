import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicBreadcrumbsExample from '../../../../examples/0-basic';
import LongBreadcrumbsExample from '../../../../examples/1-long';
import WithOnClickNoHrefBreadcrumbsExample from '../../../../examples/10-with-on-click-no-href';

it('Basic Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<BasicBreadcrumbsExample />);
  await axe(container);
});

it('Long (with ellipsis truncation) Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<LongBreadcrumbsExample />);
  await axe(container);
});

it('With onClick and no href Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<WithOnClickNoHrefBreadcrumbsExample />);
  await axe(container);
});

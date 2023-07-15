import React from 'react';

import { render } from '@testing-library/react';

import { axe, toHaveNoViolations } from '@af/accessibility-testing';

import BasicBreadcrumbsExample from '../../../../examples/0-basic';
import LongBreadcrumbsExample from '../../../../examples/1-long';
import WithOnClickNoHrefBreadcrumbsExample from '../../../../examples/10-with-on-click-no-href';

expect.extend(toHaveNoViolations);

it('Basic Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<BasicBreadcrumbsExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('Long (with ellipsis truncation) Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<LongBreadcrumbsExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('With onClick and no href Breadcrumbs example should not fail aXe audit', async () => {
  const { container } = render(<WithOnClickNoHrefBreadcrumbsExample />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

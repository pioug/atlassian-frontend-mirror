import React from 'react';

import { render } from '@atlassian/testing-library';
import { axe } from '@af/accessibility-testing';

import BasicBreadcrumbsExample from '../../../../examples/0-basic.vr.ap';
import LongBreadcrumbsExample from '../../../../examples/1-long.vr.ap';
import WithOnClickNoHrefBreadcrumbsExample from '../../../../examples/10-with-on-click-no-href';
import BreadcrumbsSkeletonExample from '../../../../examples/12-skeleton.vr.ap';

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

it('Breadcrumbs skeleton example should not fail aXe audit', async () => {
	const { container } = render(<BreadcrumbsSkeletonExample />);
	await axe(container);
});

import React from 'react';

import { render, screen, within } from '@atlassian/testing-library';

import BreadcrumbsSkeleton from '../../breadcrumbs-skeleton';
import BreadcrumbsSkeletonItem from '../../breadcrumbs-skeleton-item';

describe('BreadcrumbsSkeleton', () => {
	it('renders a loading breadcrumb landmark', async () => {
		const { container } = render(<BreadcrumbsSkeleton testId="breadcrumbs-skeleton" />);

		expect(screen.getByRole('navigation', { name: 'Loading breadcrumbs' })).toHaveAttribute(
			'aria-busy',
			'true',
		);
		expect(screen.getByTestId('breadcrumbs-skeleton')).toBeInTheDocument();
		expect(
			within(screen.getByTestId('breadcrumbs-skeleton')).getAllByRole('listitem', { hidden: true }),
		).toHaveLength(3);

		await expect(container).toBeAccessible();
	});

	it('renders custom skeleton items and size', () => {
		render(
			<BreadcrumbsSkeleton
				label="Loading project breadcrumbs"
				size="small"
				testId="breadcrumbs-skeleton"
			>
				<BreadcrumbsSkeletonItem hasIcon width={80} />
				<BreadcrumbsSkeletonItem width={56} />
				<BreadcrumbsSkeletonItem hasIcon width={120} />
			</BreadcrumbsSkeleton>,
		);

		const list = screen.getByTestId('breadcrumbs-skeleton');
		expect(within(list).getAllByRole('listitem', { hidden: true })).toHaveLength(3);
		expect(
			screen.getByRole('navigation', { name: 'Loading project breadcrumbs' }),
		).toBeInTheDocument();
	});
});

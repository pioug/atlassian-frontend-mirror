import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Skeleton from '../../src';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Skeleton', () => {
	it('should pass aXe audit for all skeleton variants', async () => {
		const testCases = [
			{
				props: { width: '200px', height: '16px', testId: 'skeleton' },
				description: 'basic skeleton',
			},
			{
				props: {
					width: '200px',
					height: '16px',
					isShimmering: true,
					testId: 'skeleton-shimmering',
				},
				description: 'shimmering skeleton',
			},
		];

		for (const { props } of testCases) {
			const { container, unmount } = render(<Skeleton {...props} />);
			await axe(container);
			unmount();
		}
	});
});

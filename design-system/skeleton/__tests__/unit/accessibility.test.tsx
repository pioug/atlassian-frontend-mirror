import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import Skeleton from '../../src';

describe('Skeleton', () => {
	it('should pass an aXe audit', async () => {
		const { container } = render(<Skeleton width="200px" height="16px" testId="skeleton" />);
		await axe(container);
	});

	it('should pass an aXe audit if shimmering', async () => {
		const { container } = render(
			<Skeleton width="200px" height="16px" isShimmering testId="skeleton-shimmering" />,
		);
		await axe(container);
	});
});

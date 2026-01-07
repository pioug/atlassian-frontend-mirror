import React from 'react';

import { render, screen } from '@testing-library/react';

import Skeleton from './index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Skeleton', () => {
	const testId = 'skeleton';

	it('should find Skeleton by its testid', async () => {
		render(<Skeleton width={200} height={8} testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});

	it('should have a width and height', () => {
		render(<Skeleton width={200} height="8px" testId={testId} />);

		expect(screen.getByTestId(testId)).toHaveStyle({
			width: '200px',
			height: '8px',
		});
	});
});

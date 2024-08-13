import React from 'react';

import { render } from '@testing-library/react';

import Skeleton from './index';

describe('Skeleton', () => {
	it('should find Skeleton by its testid', async () => {
		const testId = 'skeleton';

		const { getByTestId } = render(<Skeleton width={200} height={8} testId={testId} />);

		expect(getByTestId(testId)).toBeTruthy();
	});

	it('should have a width and height', () => {
		const testId = 'skeleton';

		const { getByTestId } = render(<Skeleton width={200} height="8px" testId={testId} />);

		expect(getByTestId(testId)).toHaveStyle({
			width: '200px',
			height: '8px',
		});
	});
});

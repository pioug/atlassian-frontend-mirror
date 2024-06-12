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

	it('should not animate when isShimmering is not specified', () => {
		const testId = 'skeleton';

		const { getByTestId } = render(<Skeleton width={200} height="8px" testId={testId} />);

		expect(getByTestId(testId)).not.toHaveStyle({
			animationName: 'animation-tt09e5',
		});
	});

	it('should animate when isShimmering is true', () => {
		const testId = 'skeleton';

		const { getByTestId } = render(
			<Skeleton width={200} height="8px" isShimmering testId={testId} />,
		);

		expect(getByTestId(testId)).toHaveStyle({
			animationName: 'animation-tt09e5',
		});
	});
});

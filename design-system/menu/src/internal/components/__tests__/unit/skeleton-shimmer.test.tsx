import React, { type ReactNode } from 'react';

import { render } from '@testing-library/react';

import SkeletonShimmer from '../../skeleton-shimmer';

describe('<SkeletonShimmer />', () => {
	const childTestId = 'child';
	const children = jest.fn<ReactNode, [{ className?: string }]>(
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		({ className }) => <div data-testid={childTestId} className={className} />,
	);

	beforeEach(() => {
		children.mockClear();
	});

	afterEach(() => {
		expect(children).toHaveBeenCalledTimes(1);
	});

	it('should render its child', () => {
		const { getByTestId } = render(<SkeletonShimmer>{children}</SkeletonShimmer>);

		expect(getByTestId(childTestId)).toBeInTheDocument();
	});

	describe('className', () => {
		it('should provide a class name when isShimmering={true}', () => {
			const { getByTestId } = render(<SkeletonShimmer isShimmering>{children}</SkeletonShimmer>);

			const child = getByTestId(childTestId);
			expect(typeof child.className).toBe('string');
		});

		it('should not provide a class name when isShimmering={false}', () => {
			const { getByTestId } = render(
				<SkeletonShimmer isShimmering={false}>{children}</SkeletonShimmer>,
			);

			const child = getByTestId(childTestId);
			expect(child.className).toBe('');
		});

		it('should not provide a class name by default', () => {
			const { getByTestId } = render(<SkeletonShimmer>{children}</SkeletonShimmer>);

			const child = getByTestId(childTestId);
			expect(child.className).toBe('');
		});
	});
});

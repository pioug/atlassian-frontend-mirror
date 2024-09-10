import React, { type ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

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
		render(<SkeletonShimmer>{children}</SkeletonShimmer>);

		expect(screen.getByTestId(childTestId)).toBeInTheDocument();
	});

	describe('className', () => {
		it('should provide a class name when isShimmering={true}', () => {
			render(<SkeletonShimmer isShimmering>{children}</SkeletonShimmer>);

			const child = screen.getByTestId(childTestId);
			expect(typeof child.className).toBe('string');
		});

		it('should not provide a class name when isShimmering={false}', () => {
			render(<SkeletonShimmer isShimmering={false}>{children}</SkeletonShimmer>);

			const child = screen.getByTestId(childTestId);
			expect(child).toHaveClass('', { exact: true });
		});

		it('should not provide a class name by default', () => {
			render(<SkeletonShimmer>{children}</SkeletonShimmer>);

			const child = screen.getByTestId(childTestId);
			expect(child).toHaveClass('', { exact: true });
		});
	});
});

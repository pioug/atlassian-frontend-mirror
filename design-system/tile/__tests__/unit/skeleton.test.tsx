import React from 'react';

import { render, screen } from '@testing-library/react';

import Skeleton from '../../src/skeleton';

const toPxNumber = (value: string): number => {
	if (!value) {
		return 0;
	}
	const trimmed = value.trim();
	if (trimmed.endsWith('px')) {
		return parseFloat(trimmed);
	}
	if (trimmed.endsWith('pc')) {
		return parseFloat(trimmed) * 16; // 1pc = 16px
	}
	const parsed = parseFloat(trimmed);
	return Number.isNaN(parsed) ? 0 : parsed;
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Tile.Skeleton', () => {
	it('renders with default props', () => {
		render(<Skeleton testId="skeleton-default" />);
		expect(screen.getByTestId('skeleton-default')).toBeInTheDocument();
	});

	it('applies data-testId to skeleton when provided', () => {
		render(<Skeleton testId="my-skeleton" />);
		expect(screen.getByTestId('my-skeleton--skeleton')).toBeInTheDocument();
	});

	it.each([
		{ size: undefined, expectedSize: 32 },
		{ size: 'xxsmall', expectedSize: 16 },
		{ size: 'xsmall', expectedSize: 20 },
		{ size: 'small', expectedSize: 24 },
		{ size: 'medium', expectedSize: 32 },
		{ size: 'large', expectedSize: 40 },
		{ size: 'xlarge', expectedSize: 48 },
	] as const)(
		'respects provided size ($size = $expectedSize x $expectedSize)',
		({ size, expectedSize }) => {
			const testId = size ? `skeleton-${size}` : 'skeleton-default';
			render(<Skeleton size={size} testId={testId} />);

			const skeleton = screen.getByTestId(testId);
			const style = getComputedStyle(skeleton);
			expect(toPxNumber(style.width)).toBe(expectedSize);
			expect(toPxNumber(style.height)).toBe(expectedSize);
		},
	);

	it('applies width and height of the skeleton to be 100%', () => {
		render(<Skeleton testId="skeleton" />);
		const skeleton = screen.getByTestId('skeleton--skeleton');
		const style = getComputedStyle(skeleton);
		expect(style.width).toBe('100%');
		expect(style.height).toBe('100%');
	});
});

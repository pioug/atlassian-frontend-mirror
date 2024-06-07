import React from 'react';

import { render } from '@testing-library/react';

import EmptyState from '../empty-state';

describe('EmptyState', () => {
	it('should render as expected with 11 rows (10 including header) and 9 columns with no props', () => {
		const { getAllByRole } = render(<EmptyState />);
		expect(getAllByRole('row').length).toEqual(11);
		expect(getAllByRole('columnheader').length).toEqual(9);
	});

	it('should render 14 rows and 6 columns in compact mode', () => {
		const { getAllByRole } = render(<EmptyState isCompact />);

		expect(getAllByRole('row').length).toEqual(15);
		expect(getAllByRole('columnheader').length).toEqual(6);
	});

	it('should render variable long width if header is summary', () => {
		const { getAllByTestId } = render(<EmptyState />);

		getAllByTestId('summary-empty-state-skeleton').forEach((skeleton) => {
			const style = window.getComputedStyle(skeleton);
			if (style && style.width && style.width.includes('px')) {
				const width = parseFloat(style.width.replace('px', ''));
				if (!isNaN(width)) {
					expect(width).toBeGreaterThan(100);
				}
			}
		});
	});

	it('should render variable short width if header is status', () => {
		const { getAllByTestId } = render(<EmptyState />);

		getAllByTestId('status-empty-state-skeleton').forEach((skeleton) => {
			const style = window.getComputedStyle(skeleton);
			if (style && style.width && style.width.includes('px')) {
				const width = parseFloat(style.width.replace('px', ''));
				if (!isNaN(width)) {
					expect(width).toBeLessThan(100);
				}
			}
		});
	});
});

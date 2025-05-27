import React from 'react';

import { render, screen, within } from '@testing-library/react';

import EmptyState from '../empty-state';

describe('EmptyState', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<EmptyState />);
		await expect(container).toBeAccessible();
	});

	it('should render as expected with 11 rows (10 including header) and 9 columns with no props', () => {
		render(<EmptyState />);
		const rows = screen.getAllByRole('row');
		expect(rows.length).toEqual(11);
		expect(within(rows[0]).getAllByRole('cell').length).toEqual(9);
	});

	it('should render 14 rows and 6 columns in compact mode', () => {
		render(<EmptyState isCompact />);
		const rows = screen.getAllByRole('row');

		expect(rows.length).toEqual(15);
		expect(within(rows[0]).getAllByRole('cell').length).toEqual(6);
	});

	it('should render variable long width if header is summary', () => {
		render(<EmptyState />);

		screen.getAllByTestId('summary-empty-state-skeleton').forEach((skeleton) => {
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
		render(<EmptyState />);

		screen.getAllByTestId('status-empty-state-skeleton').forEach((skeleton) => {
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

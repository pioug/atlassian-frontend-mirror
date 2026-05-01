import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { AIGeneratingOverlay } from './AIGeneratingOverlay';

describe('AIGeneratingOverlay', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<AIGeneratingOverlay label="Editing with Rovo" />);
		await expect(container).toBeAccessible();
	});

	it('renders an accessible progressbar with the supplied label', () => {
		render(<AIGeneratingOverlay label="Editing with Rovo" />);
		const bar = screen.getByRole('progressbar', { name: 'Editing with Rovo' });
		expect(bar).toBeInTheDocument();
		expect(bar).toHaveAttribute('aria-valuemin', '0');
		expect(bar).toHaveAttribute('aria-valuemax', '100');
	});

	it('honours the testId prop', () => {
		render(<AIGeneratingOverlay label="x" testId="foo-overlay" />);
		expect(screen.getByTestId('foo-overlay')).toBeInTheDocument();
	});

	it('renders the sliding rainbow train (4 color blocks)', () => {
		// The bar is a flex "train" of 4 hard-edged color blocks (one per
		// rainbow color). Asserting on the count guards against accidental
		// removal/duplication of blocks during refactors.
		render(<AIGeneratingOverlay label="x" />);
		expect(screen.getByTestId('ai-generating-overlay-train')).toBeInTheDocument();
		expect(screen.getAllByTestId('ai-generating-overlay-train-block')).toHaveLength(4);
	});
});

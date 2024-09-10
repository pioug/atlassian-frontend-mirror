import React from 'react';

import { render, screen } from '@testing-library/react';

import ProgressBar from '../../components/progress-bar';

const ariaLabel = 'Progress bar label';

describe('Progress Bar', () => {
	it('should render aria-label if supplied', () => {
		render(<ProgressBar value={0.4} ariaLabel={ariaLabel} />);
		const progressBarElement = screen.getByTestId('progress-bar');
		expect(progressBarElement).toHaveAttribute('aria-label', ariaLabel);
	});
});

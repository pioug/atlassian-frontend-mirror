import React from 'react';

import { render, screen } from '@testing-library/react';

import ProgressBar from '../../components/progress-bar';

const ariaLabel = 'Progress bar label';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Progress Bar', () => {
	it('should render aria-label if supplied', () => {
		render(<ProgressBar value={0.4} ariaLabel={ariaLabel} />);
		const progressBarElement = screen.getByTestId('progress-bar');
		expect(progressBarElement).toHaveAttribute('aria-label', ariaLabel);
	});

	it('should not be focusable', () => {
		render(<ProgressBar value={0.4} />);
		expect(screen.getByTestId('progress-bar')).not.toHaveAttribute('tabIndex');
	});
});

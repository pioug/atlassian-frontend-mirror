import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { ProgressBar } from '../progressBar';
import { Breakpoint } from '../../common';

describe('Progress Bar', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<ProgressBar progress={0.35} breakpoint={Breakpoint.SMALL} />);
		await expect(container).toBeAccessible();
	});

	it('should render ProgressBar properly', () => {
		const progress = 0.35;
		render(<ProgressBar progress={progress} breakpoint={Breakpoint.SMALL} />);
		const progressBar = screen.getByRole('progressbar');
		expect(progressBar).toBeInTheDocument();
		expect(progressBar).toHaveAttribute('aria-valuenow', String(progress * 100));
	});

	it('should normalize progress between [0,100]', () => {
		const { rerender } = render(<ProgressBar progress={-0.1} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

		rerender(<ProgressBar progress={1.1} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

		rerender(<ProgressBar />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

		rerender(<ProgressBar progress={0.45} />);
		expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
	});
});

import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { tickBoxClassName } from '../styles';
import { TickBox } from '../tickBox';

describe('TickBox', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<TickBox selected />);
		await expect(container).toBeAccessible();
	});

	it('should render TickBox properly', () => {
		render(<TickBox selected />);
		const tickBox = screen.getByTestId('media-card-tickbox');
		expect(tickBox).toBeInTheDocument();
		// className kept for parent hover styles defined in card/ui/styles.ts
		expect(tickBox).toHaveClass(tickBoxClassName);
		expect(screen.getByLabelText('tick')).toBeInTheDocument();
	});
});

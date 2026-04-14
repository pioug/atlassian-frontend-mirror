import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { RovoActionsButton } from '../index';

describe('RovoActionsButton', () => {
	it('should be accessible', async () => {
		const { container } = render(<RovoActionsButton testId="rovo-actions" />);
		await expect(container).toBeAccessible();
	});

	it('renders the indicator', () => {
		render(<RovoActionsButton testId="rovo-actions" />);
		expect(screen.getByTestId('rovo-actions')).toBeInTheDocument();
	});

	it('renders the Rovo icon with accessible label', () => {
		render(<RovoActionsButton testId="rovo-actions" />);
		expect(screen.getByRole('img', { name: 'Rovo' })).toBeInTheDocument();
	});
});

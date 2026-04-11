import React from 'react';

import { render, screen } from '@atlassian/testing-library';

import { RovoPostAuthActionsModal } from '../index';

describe('RovoPostAuthActionsModal', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<RovoPostAuthActionsModal
				title="My document"
				url="https://example.com"
				testId="rovo-modal"
			/>,
		);
		await expect(container).toBeAccessible();
	});

	it('renders the modal container', () => {
		render(
			<RovoPostAuthActionsModal
				title="My document"
				url="https://example.com"
				testId="rovo-modal"
			/>,
		);
		expect(screen.getByTestId('rovo-modal')).toBeInTheDocument();
	});

	it('renders the title as a link with the correct href', () => {
		render(
			<RovoPostAuthActionsModal
				title="My document"
				url="https://example.com"
				testId="rovo-modal"
			/>,
		);
		const link = screen.getByRole('link', { name: 'My document' });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', 'https://example.com');
	});

	it('renders all four action buttons', () => {
		render(
			<RovoPostAuthActionsModal
				title="My document"
				url="https://example.com"
				testId="rovo-modal"
			/>,
		);
		expect(screen.getAllByRole('button')).toHaveLength(4);
	});
});

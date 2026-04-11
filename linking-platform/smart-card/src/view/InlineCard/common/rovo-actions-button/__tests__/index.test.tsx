import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { fireEvent, render, screen } from '@atlassian/testing-library';

import { RovoActionsButton } from '../index';

describe('RovoActionsButton', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<IntlProvider locale="en">
				<RovoActionsButton testId="rovo-actions-button" title="My doc" url="https://example.com" />
			</IntlProvider>,
		);
		await expect(container).toBeAccessible();
	});

	it('renders the button', () => {
		render(
			<IntlProvider locale="en">
				<RovoActionsButton testId="rovo-actions-button" />
			</IntlProvider>,
		);
		expect(screen.getByTestId('rovo-actions-button')).toBeInTheDocument();
	});

	it('shows "Explore" text', () => {
		render(
			<IntlProvider locale="en">
				<RovoActionsButton />
			</IntlProvider>,
		);
		expect(screen.getByText('Explore')).toBeInTheDocument();
	});

	it('calls onClick when clicked', () => {
		const onClick = jest.fn();
		render(
			<IntlProvider locale="en">
				<RovoActionsButton
					testId="rovo-actions-button"
					title="My doc"
					url="https://example.com"
					onClick={onClick}
				/>
			</IntlProvider>,
		);
		fireEvent.click(screen.getByTestId('rovo-actions-button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('opens the popup when clicked', async () => {
		render(
			<IntlProvider locale="en">
				<RovoActionsButton testId="rovo-actions-button" title="My doc" url="https://example.com" />
			</IntlProvider>,
		);
		fireEvent.click(screen.getByTestId('rovo-actions-button'));
		expect(await screen.findByTestId('rovo-actions-button-popup')).toBeInTheDocument();
	});

	it('closes the popup when clicked again', async () => {
		render(
			<IntlProvider locale="en">
				<RovoActionsButton testId="rovo-actions-button" title="My doc" url="https://example.com" />
			</IntlProvider>,
		);
		fireEvent.click(screen.getByTestId('rovo-actions-button'));
		expect(await screen.findByTestId('rovo-actions-button-popup')).toBeInTheDocument();
		fireEvent.click(screen.getByTestId('rovo-actions-button'));
		expect(screen.queryByTestId('rovo-actions-button-popup')).not.toBeInTheDocument();
	});
});

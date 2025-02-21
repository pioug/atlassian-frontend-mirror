import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { DisconnectDialog, DisconnectDialogProps, messages } from './index';

const renderComponent = (props: Partial<DisconnectDialogProps> = {}) => {
	const defaultProps: DisconnectDialogProps = {
		containerName: 'Test Container',
		containerType: 'JiraProject',
		onDisconnect: jest.fn().mockResolvedValue(undefined),
		onClose: jest.fn(),
	};
	return render(
		<IntlProvider locale="en">
			<DisconnectDialog {...defaultProps} {...props} />
		</IntlProvider>,
	);
};

describe('DisconnectDialog', () => {
	it('renders the dialog with correct title and description', () => {
		renderComponent();
		expect(screen.getByText(messages.disconnectDialogTitle.defaultMessage)).toBeInTheDocument();
		expect(screen.getByText(/This team will no longer be connected to the/)).toBeInTheDocument();
		expect(screen.getByText(/Disconnecting the team from the/)).toBeInTheDocument();
	});

	it('calls onClose when the cancel button is clicked', async () => {
		const onClose = jest.fn();
		renderComponent({ onClose });
		await userEvent.click(screen.getByText(messages.disconnectDialogCancelButton.defaultMessage));
		expect(onClose).toHaveBeenCalled();
	});

	it('calls onDisconnect when the remove button is clicked', async () => {
		const onDisconnect = jest.fn().mockResolvedValue(undefined);
		renderComponent({ onDisconnect });
		await userEvent.click(screen.getByText(messages.disconnectDialogRemoveButton.defaultMessage));
		await waitFor(() => expect(onDisconnect).toHaveBeenCalled());
	});
});

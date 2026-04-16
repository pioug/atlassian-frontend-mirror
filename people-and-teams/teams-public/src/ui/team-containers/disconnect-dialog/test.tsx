import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { DisconnectDialog, type DisconnectDialogProps, messages } from './index';

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
	it('should capture and report a11y violations', async () => {
		const { container } = renderComponent();
		await expect(container).toBeAccessible();
	});

	ffTest.on(
		'workforce_optimization_team_modal_update',
		'should show new disclaimer for JiraProject when flag is ON',
		() => {
			it('should show "might affect" wording for JiraProject', () => {
				renderComponent({ containerType: 'JiraProject' });
				expect(
					screen.getByText(/might affect work connected to the team within the project/),
				).toBeInTheDocument();
			});

			it('should show "will not affect" wording for ConfluenceSpace', () => {
				renderComponent({ containerType: 'ConfluenceSpace' });
				expect(
					screen.getByText(/will not affect any work connected to the team within the space/),
				).toBeInTheDocument();
			});
		},
	);

	ffTest.off(
		'workforce_optimization_team_modal_update',
		'should show old disclaimer when flag is OFF',
		() => {
			it('should show "will not affect" wording for JiraProject', () => {
				renderComponent({ containerType: 'JiraProject' });
				expect(
					screen.getByText(/will not affect any work connected to the team within the/),
				).toBeInTheDocument();
			});
		},
	);
});

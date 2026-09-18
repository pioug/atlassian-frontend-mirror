import React from 'react';

import { IntlProvider } from 'react-intl';

import { render, screen } from '@atlassian/testing-library';

import { DeleteUserOverviewScreen } from '../../components/DeleteUserOverviewScreen';
import { type DeleteUserOverviewScreenProps } from '../../components/DeleteUserOverviewScreen/types';
import accessibleSites from '../../mocks/accessibleSites';
import { catherineHirons } from '../../mocks/users';

const defaultProps: Partial<DeleteUserOverviewScreenProps> = {
	accessibleSites,
	isCurrentUser: false,
	user: catherineHirons,
	isUserDeactivated: false,
};

const renderWithIntl = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<DeleteUserOverviewScreen {...defaultProps} {...props} />
		</IntlProvider>,
	);

test('DeleteUserOverviewScreen', async () => {
	renderWithIntl();
	expect(await screen.findByText('Delete account')).toBeInTheDocument();
	expect(await screen.findByText('Catherine Hirons')).toBeInTheDocument();
	expect(await screen.findByText('When you delete the account:')).toBeInTheDocument();

	await expect(document.body).toBeAccessible();
});

describe('selectAdminOrSelfCopy', () => {
	test('selects admin copy if delete candidate is not current user', async () => {
		renderWithIntl({ isCurrentUser: false });
		expect(screen.getByText('Delete account')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	test('selects self copy if delete candidate is current user', async () => {
		renderWithIntl({ isCurrentUser: true });
		expect(screen.getByText('Delete your account')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});
});

describe('accessibleSites display', () => {
	test('text displayed is different when no accessibleSites prop is passed', async () => {
		renderWithIntl({
			deactivateUserHandler: () => {},
			accessibleSites: [],
		});

		expect(screen.getByText(/Catherine Hirons will/i)).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	test('text displayed is different when no accessibleSites prop is passed for current user', async () => {
		renderWithIntl({
			deactivateUserHandler: () => {},
			accessibleSites: [],
			isCurrentUser: true,
		});

		expect(screen.getByText('immediately lose access')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});

describe('deactivateUserHandler display', () => {
	test('warning section is not displayed if the deactivateUserHandler prop is not passed', async () => {
		renderWithIntl();
		expect(screen.queryByText(/After a 14-day grace period/i)).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});

describe('delete screen display', () => {
	test('content is different when user is deactivated', async () => {
		renderWithIntl({
			isUserDeactivated: true,
			deactivateUserHandler: () => {},
		});

		expect(screen.getByText(/After a 14-day grace period/i)).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /deactivate account/i })).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});

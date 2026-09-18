import React from 'react';

// eslint-disable-next-line @atlassian/testing-library/prefer-atlassian-testing-library
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { DeactivateUserOverviewScreen } from '../../components/DeactivateUserOverviewScreen';
import { type DeactivateUserOverviewScreenProps } from '../../components/DeactivateUserOverviewScreen/types';
import accessibleSites from '../../mocks/accessibleSites';
import { catherineHirons } from '../../mocks/users';

const defaultProps: Partial<DeactivateUserOverviewScreenProps> = {
	accessibleSites,
	isCurrentUser: false,
	user: catherineHirons,
};

const renderWithIntl = (props = {}) =>
	render(
		<IntlProvider locale="en">
			<DeactivateUserOverviewScreen {...defaultProps} {...props} />
		</IntlProvider>,
	);

describe('accessibleSites display', () => {
	test('text displayed is different when no accessibleSites prop is passed', async () => {
		renderWithIntl({
			accessibleSites: [],
		});
		// When admin (isCurrentUser: false) and no sites, the no-sites paragraph is rendered
		expect(screen.getByText(/Catherine Hirons will/, { exact: false })).toBeInTheDocument();
		expect(screen.getByText(/don.t have access to any/, { exact: false })).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	test('text displayed is different when no accessibleSites prop is passed for current user', async () => {
		renderWithIntl({
			accessibleSites: [],
			isCurrentUser: true,
		});
		// When self (isCurrentUser: true) and no sites, the self no-sites paragraph is rendered
		expect(screen.getByText(/You'll/, { exact: false })).toBeInTheDocument();
		expect(screen.getByText(/you don.t have access to any/, { exact: false })).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});

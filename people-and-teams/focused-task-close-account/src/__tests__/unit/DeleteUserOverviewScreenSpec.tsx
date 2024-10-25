import React from 'react';
import { shallow } from 'enzyme';
import { render as renderRTL, screen } from '@testing-library/react';
import { DeleteUserOverviewScreen } from '../../components/DeleteUserOverviewScreen';
import { catherineHirons } from '../../mocks/users';
import accessibleSites from '../../mocks/accessibleSites';
import { type DeleteUserOverviewScreenProps } from '../../components/DeleteUserOverviewScreen/types';
import { IntlProvider } from 'react-intl-next';

const defaultProps: Partial<DeleteUserOverviewScreenProps> = {
	accessibleSites,
	isCurrentUser: false,
	user: catherineHirons,
	isUserDeactivated: false,
};

const render = (props = {}) => shallow(<DeleteUserOverviewScreen {...defaultProps} {...props} />);
const renderWithRTL = (props = {}) =>
	renderRTL(
		<IntlProvider locale="en">
			<DeleteUserOverviewScreen {...defaultProps} {...props} />
		</IntlProvider>,
	);

test('DeleteUserOverviewScreen', async () => {
	renderWithRTL();
	expect(await screen.findByText('Delete account')).toBeInTheDocument();
	expect(await screen.findByText('Catherine Hirons')).toBeInTheDocument();
	expect(await screen.findByText('When you delete the account:')).toBeInTheDocument();
});

describe('selectAdminOrSelfCopy', () => {
	test('selects admin copy if delete candidate is not current user', () => {
		const selectAdminOrSelfCopy = (
			render({
				deactivateUserHandler: () => {},
				isCurrentUser: false,
			}).instance() as DeleteUserOverviewScreen
		).selectAdminOrSelfCopy;
		expect(selectAdminOrSelfCopy('admin' as any, 'self' as any)).toBe('admin');
	});

	test('selects self copy if delete candidate is current user', () => {
		const selectAdminOrSelfCopy = (
			render({
				deactivateUserHandler: () => {},
				isCurrentUser: true,
			}).instance() as DeleteUserOverviewScreen
		).selectAdminOrSelfCopy;
		expect(selectAdminOrSelfCopy('admin' as any, 'self' as any)).toBe('self');
	});
});

describe('accessibleSites display', () => {
	test('text displayed is different when no accessibleSites prop is passed', () => {
		expect(
			render({
				deactivateUserHandler: () => {},
				accessibleSites: [],
			}),
		).toMatchSnapshot();
	});

	test('text displayed is different when no accessibleSites prop is passed for current user', () => {
		expect(
			render({
				deactivateUserHandler: () => {},
				accessibleSites: [],
				isCurrentUser: true,
			}),
		).toMatchSnapshot();
	});
});

describe('deactivateUserHandler display', () => {
	test('warning section is not displayed if the deactivateUserHandler prop is not passed', () => {
		expect(render()).toMatchSnapshot();
	});
});

describe('delete screen display', () => {
	test('content is different when user is deactivated', () => {
		expect(
			render({
				isUserDeactivated: true,
				deactivateUserHandler: () => {},
			}),
		).toMatchSnapshot();
	});
});

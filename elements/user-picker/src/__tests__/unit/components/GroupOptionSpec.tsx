import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { GroupOption } from '../../../components/GroupOption/main';
import { type Group } from '../../../types';

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon/main', () => ({
	...jest.requireActual('@atlaskit/people-teams-ui-public/verified-team-icon/main'),
	VerifiedTeamIcon: () => <span data-testid="verified-team-icon">Verified team</span>,
}));

describe('GroupOption', () => {
	const group: Group = {
		id: 'group-66',
		name: 'dead-jedi-admins',
		type: 'group',
	};

	const renderGroupOption = (props: Partial<React.ComponentProps<typeof GroupOption>> = {}) =>
		render(
			<IntlProvider locale="en" messages={{}}>
				<GroupOption isSelected={false} group={group} includeTeamsUpdates={false} {...props} />
			</IntlProvider>,
		);

	it('renders the group name and admin-managed byline', async () => {
		renderGroupOption();

		expect(screen.getByText(group.name)).toBeInTheDocument();
		expect(screen.getByTestId('user-picker-group-secondary-text')).toHaveTextContent(
			'Admin-managed group',
		);
		await expect(document.body).toBeAccessible();
	});

	it('renders the same option content when selected', () => {
		renderGroupOption({ isSelected: true });

		expect(screen.getByText(group.name)).toBeInTheDocument();
		expect(screen.getByTestId('user-picker-group-secondary-text')).toHaveTextContent(
			'Admin-managed group',
		);
	});

	it('highlights the configured part of the group name', () => {
		const { container } = renderGroupOption({
			group: {
				...group,
				highlight: { name: [{ start: 4, end: 11 }] },
			},
		});

		expect(container.querySelector('b')).toHaveTextContent('-jedi-ad');
		expect(container).toHaveTextContent(group.name);
	});

	it('renders the verified icon in the byline when teams updates are enabled', () => {
		renderGroupOption({ includeTeamsUpdates: true });

		expect(screen.getByTestId('verified-team-icon')).toBeInTheDocument();
		expect(screen.getByTestId('user-picker-group-secondary-text')).toHaveTextContent('Admin group');
	});
});

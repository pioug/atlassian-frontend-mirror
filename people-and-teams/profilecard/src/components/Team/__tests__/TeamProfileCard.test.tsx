import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import TeamProfileCard from '../TeamProfileCard';

const mockAnalytics = jest.fn();

const createMembers = (count: number) => {
	return Array.from({ length: count }, (_, i) => ({
		id: String(i),
		fullName: `user-${i}`,
		avatarUrl: `avatar-url-${i}`,
	}));
};

const createTeam = (membersCount: number = 2) => ({
	id: 'team-1',
	displayName: 'Test Team',
	description: 'This is a test team',
	members: createMembers(membersCount),
	largeHeaderImageUrl: 'large-image-url',
	smallHeaderImageUrl: 'small-image-url',
	isVerified: true,
});

const actions = [
	{
		label: 'Action 1',
		link: 'https://example.com/action1',
		callback: jest.fn(),
		id: 'action-1',
	},
];

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon', () => ({
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
}));

const renderComponent = (props = {}) => {
	return render(
		<IntlProvider locale="en">
			<TeamProfileCard
				team={createTeam()}
				viewingUserId="1"
				generateUserLink={jest.fn()}
				onUserClick={jest.fn()}
				viewProfileLink="https://example.com/profile"
				viewProfileOnClick={jest.fn()}
				analytics={mockAnalytics}
				actions={actions}
				{...props}
			/>
		</IntlProvider>,
	);
};

describe('TeamProfileCard', () => {
	test('renders the verified team icon when team is verified', () => {
		renderComponent();

		expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
		expect(screen.getByText('Test Team')).toBeInTheDocument();
		expect(screen.getByText('This is a test team')).toBeInTheDocument();
		expect(screen.getByText('VerifiedTeamIcon')).toBeInTheDocument();
	});

	test('does not render the verified team icon when team is not verified', () => {
		renderComponent({ team: { ...createTeam(), isVerified: false } });

		expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
		expect(screen.getByText('Test Team')).toBeInTheDocument();
		expect(screen.getByText('This is a test team')).toBeInTheDocument();
		expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();
	});

	ffTest.on('platform_profilecard-enable_reporting_lines_label', 'with aria label enabled', () => {
		test('displays a more indicator when there are more than 9 reports', () => {
			renderComponent({ team: createTeam(10) });

			const moreIndicator = screen.getByText('+2', { selector: 'button' });
			expect(moreIndicator).toBeInTheDocument();
			expect(moreIndicator).toHaveAttribute('aria-label', '+2 more members');
		});
	});

	ffTest.off(
		'platform_profilecard-enable_reporting_lines_label',
		'with aria label disabled',
		() => {
			test('displays a more indicator when there are more than 9 reports', () => {
				renderComponent({ team: createTeam(10) });

				const moreIndicator = screen.getByText('+2', { selector: 'button' });
				expect(moreIndicator).toBeInTheDocument();
				expect(moreIndicator).not.toHaveAttribute('aria-label');
			});
		},
	);

	ffTest.on(
		'enable_team_profilecard_toggletip_a11y_fix',
		'with enable_team_profilecard_toggletip_a11y_fix enabled',
		() => {
			test('renders the avatar group with the overrides', () => {
				renderComponent({ team: createTeam(10) });

				const avatarGroup = screen.getByTestId('profilecard-avatar-group--avatar-group');
				const firstAvatar = screen.getByTestId('first-member');
				expect(avatarGroup).toBeInTheDocument();
				expect(firstAvatar).toBeInTheDocument();
			});
		},
	);

	ffTest.off(
		'enable_team_profilecard_toggletip_a11y_fix',
		'with enable_team_profilecard_toggletip_a11y_fix disabled',
		() => {
			test('renders the avatar group with the overrides', () => {
				renderComponent({ team: createTeam(10) });

				const avatarGroup = screen.getByTestId('profilecard-avatar-group--avatar-group');
				const firstAvatar = screen.queryByTestId('first-member');
				expect(avatarGroup).toBeInTheDocument();
				expect(firstAvatar).not.toBeInTheDocument();
			});
		},
	);
});

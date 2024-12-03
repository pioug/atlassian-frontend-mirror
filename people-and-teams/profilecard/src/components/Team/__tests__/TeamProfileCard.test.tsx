import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';

import TeamProfileCard from '../TeamProfileCard';

const mockAnalytics = jest.fn();

const team = {
	id: 'team-1',
	displayName: 'Test Team',
	description: 'This is a test team',
	members: [
		{ id: '1', fullName: 'User One', avatarUrl: 'avatar-url-1' },
		{ id: '2', fullName: 'User Two', avatarUrl: 'avatar-url-2' },
	],
	largeHeaderImageUrl: 'large-image-url',
	smallHeaderImageUrl: 'small-image-url',
	isVerified: true,
};

const actions = [
	{
		label: 'Action 1',
		link: 'https://example.com/action1',
		callback: jest.fn(),
		id: 'action-1',
	},
];

jest.mock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual('@atlaskit/platform-feature-flags'),
	fg: jest.fn(),
}));

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon', () => ({
	VerifiedTeamIcon: () => <div>VerifiedTeamIcon</div>,
}));

const mockCheckGate = fg as jest.Mock;

const renderComponent = (props = {}) => {
	return render(
		<IntlProvider locale="en">
			<TeamProfileCard
				team={team}
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
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('when feature gate show_verified_team_icon_in_profile_card is enabled', () => {
		beforeEach(() => {
			mockCheckGate.mockReturnValue(true);
		});

		it('renders the verified team icon when team is verified', () => {
			renderComponent();

			expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
			expect(screen.getByText('Test Team')).toBeInTheDocument();
			expect(screen.getByText('This is a test team')).toBeInTheDocument();
			expect(screen.getByText('VerifiedTeamIcon')).toBeInTheDocument();
		});

		it('does not render the verified team icon when team is not verified', () => {
			renderComponent({ team: { ...team, isVerified: false } });

			expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
			expect(screen.getByText('Test Team')).toBeInTheDocument();
			expect(screen.getByText('This is a test team')).toBeInTheDocument();
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();
		});
	});

	describe('when feature gate show_verified_team_icon_in_profile_card is disabled', () => {
		beforeEach(() => {
			mockCheckGate.mockReturnValue(false);
		});

		it('does not render the verified team icon', () => {
			renderComponent();

			expect(screen.getByTestId('team-profilecard')).toBeInTheDocument();
			expect(screen.getByText('Test Team')).toBeInTheDocument();
			expect(screen.getByText('This is a test team')).toBeInTheDocument();
			expect(screen.queryByText('VerifiedTeamIcon')).not.toBeInTheDocument();
		});
	});
});

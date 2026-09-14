import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import { TeamOption } from '../../../components/TeamOption/main';
import { type Team } from '../../../types';

jest.mock('../../../components/textWrapper', () => ({
	...(jest.requireActual('../../../components/textWrapper') as any),
	textWrapper: jest.fn(() => undefined),
}));

jest.mock('../../../components/AvatarItemOption', () => ({
	AvatarItemOption: ({ children, primaryText, secondaryText, avatar }: any) => (
		<div>
			{avatar}
			<div>{primaryText}</div>
			<div>{secondaryText}</div>
			{children}
		</div>
	),
}));

jest.mock('../../../components/SizeableAvatar', () => ({
	SizeableAvatar: () => <div>Team avatar</div>,
}));

jest.mock('@atlaskit/people-teams-ui-public/verified-team-icon/main', () => ({
	VerifiedTeamIcon: () => <div>Verified team</div>,
}));

describe('Team Option', () => {
	const basicTeam: Team = {
		id: 'team-7',
		name: 'Team-1',
		avatarUrl: 'https://avatars.atlassian.com/team-1.png',
		type: 'team',
	};

	const renderTeam = (
		teamData: Partial<Team> = {},
		props: { includeTeamsUpdates?: boolean; isSelected?: boolean } = {},
	) => {
		const team = { ...basicTeam, ...teamData };
		return render(
			<IntlProvider locale="en">
				<TeamOption
					team={team}
					isSelected={props.isSelected ?? false}
					includeTeamsUpdates={props.includeTeamsUpdates ?? false}
				/>
			</IntlProvider>,
		);
	};

	it('should render team name and avatar', async () => {
		renderTeam();

		expect(screen.getByText('Team-1')).toBeInTheDocument();
		expect(screen.getByText('Team avatar')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should not render a byline when member count is unavailable', async () => {
		renderTeam({ includesYou: true });

		expect(screen.queryByTestId('user-picker-team-secondary-text')).not.toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render the member count byline', async () => {
		renderTeam({ memberCount: 45 }, { isSelected: true });

		expect(screen.getByTestId('user-picker-team-secondary-text')).toHaveTextContent(
			'Team • 45 members',
		);
		await expect(document.body).toBeAccessible();
	});

	it('should render the 50+ member byline', async () => {
		renderTeam({ memberCount: 51 });

		expect(screen.getByTestId('user-picker-team-secondary-text')).toHaveTextContent(
			'Team • 50+ members',
		);
		await expect(document.body).toBeAccessible();
	});

	it('should include you in the member count byline', async () => {
		renderTeam({ includesYou: true, memberCount: 2 });

		expect(screen.getByTestId('user-picker-team-secondary-text')).toHaveTextContent(
			'Team • 2 members, including you',
		);
		await expect(document.body).toBeAccessible();
	});

	it('should render the verified icon', async () => {
		renderTeam({ verified: true });

		expect(screen.getByText('Verified team')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});

	it('should render a custom byline', async () => {
		renderTeam({ byline: 'A custom byline', memberCount: 45 });

		expect(screen.getByText('A custom byline')).toBeInTheDocument();
		await expect(document.body).toBeAccessible();
	});
});

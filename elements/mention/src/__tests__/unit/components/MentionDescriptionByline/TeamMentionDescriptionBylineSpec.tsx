import React from 'react';
import { IntlProvider } from 'react-intl-next';
import TeamMentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { type MentionDescription } from '../../../..//types';
import { teamMention } from './_commonData';
import { screen, render } from '@testing-library/react';

const renderByline = (teamData: MentionDescription) => {
	return render(
		<IntlProvider locale="en">
			<TeamMentionDescriptionByline mention={teamData} />
		</IntlProvider>,
	);
};

const buildTeamData = (memberCount: number, includesYou: boolean) => ({
	...teamMention,
	context: {
		members: [
			{
				id: 'user-1234',
				name: 'Test User',
			},
		],
		...teamMention.context,
		includesYou: includesYou,
		memberCount: memberCount,
		teamLink: '/wiki/people/team/12345',
	},
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Team mention description', () => {
	it('should render Team Mention description component with less than 50 members, includes you', () => {
		renderByline(buildTeamData(5, true));

		expect(screen.getByText('Team • 5 members, including you')).toBeInTheDocument();
	});

	it('should render Team Mention description component with more than 50 members, includes you', () => {
		renderByline(buildTeamData(55, true));

		expect(screen.getByText('Team • 50+ members, including you')).toBeInTheDocument();
	});

	it('should render Team Mention description component with less than 50 members, not including you', () => {
		renderByline(buildTeamData(4, false));

		expect(screen.getByText('Team • 4 members')).toBeInTheDocument();
	});

	it('should render Team Mention description component with more than 50 members, not including you', () => {
		renderByline(buildTeamData(100, false));

		expect(screen.getByText('Team • 50+ members')).toBeInTheDocument();
	});

	it('should not render Team Mention description component if context is not given', () => {
		const newMention = { ...teamMention };
		delete newMention.context;

		renderByline(newMention);

		const team = screen.queryByText('Team');
		expect(team).toBeNull();
	});
});

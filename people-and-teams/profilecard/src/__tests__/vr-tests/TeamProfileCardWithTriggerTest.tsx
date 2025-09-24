/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import TeamProfilecardTrigger from '../../components/Team';
import { staticTeamData } from '../../mocks/team-data';
import { type ProfileClient, type Team } from '../../types';

const teamClientData: {
	team: Team;
	timeout: number;
	error: any;
	errorRate: number;
	traceId: string;
} = {
	team: staticTeamData({
		headerImage: 'Picture',
		members: 15,
	}),
	timeout: 0,
	error: {},
	errorRate: 0,
	traceId: 'trace-id',
};

const profileClient = {
	getTeamProfile: () => Promise.resolve(teamClientData.team),
	shouldShowGiveKudos: () => Promise.resolve(true),
	getTeamCentralBaseUrl: () => Promise.resolve('mock-team-central-base-url'),
} as unknown as ProfileClient;

const defaultProps = {
	teamId: '4ecf4119-dcc4-43a0-a60b-94ed7b7446b0',
	orgId: 'DUMMY',
	resourceClient: profileClient,
	actions: [
		{
			id: 'secondary',
			label: 'Secondary',
			callback: () => {},
			link: 'about:blank',
		},
		{
			id: 'callback-option',
			label: 'Option with callback',
			callback: () => alert('First option clicked'),
		},
		{
			id: 'link-option',
			label: 'Option with link',
			link: 'about:blank',
		},
		{
			id: 'both-option',
			label: 'Option with both',
			callback: () => alert('Third option clicked'),
			link: 'about:blank',
		},
	],
	viewProfileLink: 'about:blank',
	viewProfileOnClick: () => alert('Viewing profile.'),
	generateUserLink: (userId: string) => `/people/${userId}`,
};

export const TeamProfileCardWithTriggerTest = () => {
	return (
		<Wrapper>
			<span>
				Hover to preview the team:{' '}
				<TeamProfilecardTrigger {...defaultProps} trigger="hover">
					<strong data-testId="trigger">The Cool Team</strong>
				</TeamProfilecardTrigger>
			</span>
		</Wrapper>
	);
};

// As part of HOT-109153, we saw the profilecard inheriting styles from its parents
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
const styles = cssMap({ wrapper: {
		'a': {
			color: 'green',
		},
		fontSize: '30px',
	},
});
const Wrapper = ({ children }: { children: React.ReactNode }) => {
	return <div css={styles.wrapper}>{children}</div>
};

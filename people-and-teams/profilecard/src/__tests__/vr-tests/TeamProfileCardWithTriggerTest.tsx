/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect } from 'react';

import { cssMap, jsx } from '@compiled/react';

import FeatureGates, { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';

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

export const TeamProfileCardWithDisbandedState = () => {
	const disbandedTeam: Team = {
		...staticTeamData({
			headerImage: 'Picture',
			members: 15,
		}),
		state: 'DISBANDED',
	};

	useEffect(() => {
		async function setUpExperiments() {
			if (!FeatureGates.initializeCalled()) {
				const formValues = {
					environment: FeatureGateEnvironment.Development,
					localMode: true,
					targetApp: '',
				};
				await FeatureGates.initializeFromValues(formValues, {});
			}
			FeatureGates.overrideConfig('new_team_profile', { isEnabled: true });
		}
		setUpExperiments();
	}, []);

	const disbandedProfileClient = {
		getTeamProfile: () => Promise.resolve(disbandedTeam),
		shouldShowGiveKudos: () => Promise.resolve(true),
		getTeamCentralBaseUrl: () => Promise.resolve('mock-team-central-base-url'),
	} as unknown as ProfileClient;

	return (
		<Wrapper>
			<span>
				Hover to preview the disbanded team:{' '}
				<TeamProfilecardTrigger
					{...defaultProps}
					resourceClient={disbandedProfileClient}
					trigger="hover"
				>
					<strong data-testId="trigger-disbanded">The Archived Team</strong>
				</TeamProfilecardTrigger>
			</span>
		</Wrapper>
	);
};

// As part of HOT-109153, we saw the profilecard inheriting styles from its parents
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
const styles = cssMap({
	wrapper: {
		a: {
			color: 'green',
		},
		fontSize: '30px',
	},
});
const Wrapper = ({ children }: { children: React.ReactNode }) => {
	return <div css={styles.wrapper}>{children}</div>;
};

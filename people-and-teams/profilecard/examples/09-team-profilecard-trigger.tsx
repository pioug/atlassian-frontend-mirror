import React, { useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import ProfileCardClient from '../src/client/ProfileCardClient';
import TeamProfileCardClient from '../src/client/TeamProfileCardClient';
import TeamProfilecardTrigger from '../src/components/Team';
import teamData from '../src/mocks/team-data';
import { type Team } from '../src/types';

import { Radios, TeamCustomizer } from './helper/customization';
import ExampleWrapper from './helper/example-wrapper';
import { getMockTeamClient } from './helper/util';

const clientArgs = {
	cacheSize: 10,
	cacheMaxAge: 0,
	url: 'DUMMY',
	gatewayGraphqlUrl: 'https://api-private.stg.atlassian.com/graphql',
	cloudId: 'site-id',
};

const defaultTeamData = teamData({
	headerImage: 'Picture',
	members: 15,
});

const myTeamData = {
	...defaultTeamData,
};

const teamClientData: {
	team: Team;
	timeout: number;
	error: any;
	errorRate: number;
	traceId: string;
} = {
	team: myTeamData,
	timeout: 500,
	error: {},
	errorRate: 0,
	traceId: 'trace-id',
};

const MockTeamClient = getMockTeamClient(teamClientData);

const realTeamClient = new TeamProfileCardClient(clientArgs);
const mockTeamClient = new MockTeamClient(clientArgs);

const profileClient = new ProfileCardClient(clientArgs, {
	teamClient: mockTeamClient,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const MainStage = styled.div({
	margin: token('space.200', '16px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Section = styled.div({
	margin: `${token('space.200', '16px')} 0`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	h4: {
		margin: `${token('space.100', '8px')} 0`,
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const BlankSpace = styled.div({
	height: '800px',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	border: `1px solid ${token('color.border', '#ccc')}`,
	borderRadius: '3px',
	margin: token('space.100', '8px'),
	padding: token('space.100', '8px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	strong: {
		color: token('color.text', 'black'),
	},
});

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

function CustomizationPanel() {
	const [timeout, setTimeout] = useState(500);
	const [errorRate, setErrorRate] = useState(0);

	return (
		<MainStage>
			Timeout
			<Radios
				label="timeout"
				options={[0, 100, 500, 1000, 3000, 10000]}
				setter={(value) => {
					setTimeout(value);
					teamClientData.timeout = value;
				}}
				currentValue={timeout}
			/>
			Error rate
			<Radios
				label="errorRate"
				options={[0, 0.2, 0.5, 0.8, 1]}
				setter={(value) => {
					setErrorRate(value);
					teamClientData.errorRate = value;
				}}
				currentValue={errorRate}
			/>
		</MainStage>
	);
}

export default function Example() {
	const [includingYou, setIncludingYou] = useState(false);
	const [numActions, setNumActions] = useState(0);
	const [isRealClient, setRealClient] = useState(false);

	const viewerId = includingYou ? teamClientData.team.members![0]?.id : '';

	// Just here for testing purposes
	useEffect(() => {
		if (isRealClient) {
			profileClient.teamClient = realTeamClient;
		} else {
			profileClient.teamClient = mockTeamClient;
		}
	}, [isRealClient]);

	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<Container>
						<h4>Profilecard triggerLinkType none</h4>
						<span>
							Hover to preview the team:{' '}
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="hover"
								triggerLinkType="none"
								viewingUserId={viewerId}
							>
								<strong>The Cool Team</strong>
							</TeamProfilecardTrigger>
						</span>
					</Container>
					<Container>
						<h4>Profilecard triggered by hover</h4>
						<span>
							Hover to preview the team:{' '}
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="hover"
								viewingUserId={viewerId}
							>
								<strong>The Cool Team</strong>
							</TeamProfilecardTrigger>
						</span>
					</Container>
					<Container>
						<h4>Profilecard triggered by click</h4>
						<span>
							Click on them to preview:{' '}
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="click"
								viewingUserId={viewerId}
							>
								<strong>The Nice Team</strong>
							</TeamProfilecardTrigger>
						</span>
					</Container>
					<Container>
						<h4>Profilecard triggered by hover or click</h4>
						<span>
							Click on them to preview:{' '}
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="hover-click"
								viewingUserId={viewerId}
							>
								<strong>The Hover-Clicky Team</strong>
							</TeamProfilecardTrigger>
						</span>
						<p>
							This will try to be "smart" to determine whether to close correctly on mousing away or
							not.
						</p>
					</Container>
				</Section>
				<CustomizationPanel />
				<p>
					Including you?
					<label htmlFor="includingYou">
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
						<input
							checked={includingYou}
							id="includingYou"
							onChange={() => setIncludingYou(!includingYou)}
							type="checkbox"
						/>
						{includingYou}
					</label>
				</p>
				<p>
					Use real client?
					{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
					<label htmlFor="realClient">
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
						<input
							checked={isRealClient}
							id="realClient"
							onChange={() => setRealClient(!isRealClient)}
							type="checkbox"
						/>
					</label>
				</p>
				<TeamCustomizer
					setTeam={(team) => {
						teamClientData.team = team;
					}}
				/>
				Extra actions
				<Radios
					label="actions"
					options={[0, 1, 2, 3, 4]}
					setter={(value) => {
						setNumActions(value);
					}}
					currentValue={numActions}
				/>
				<BlankSpace>Scroll down to test focus behaviour</BlankSpace>
				<Section>
					<Container>
						<h4>Extras at the bottom of the page to test focus bouncing</h4>
						<span>
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="hover"
								viewingUserId={viewerId}
							>
								<strong>Hover team</strong>
							</TeamProfilecardTrigger>{' '}
							|||{' '}
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="click"
								viewingUserId={viewerId}
							>
								<strong>Click team</strong>
							</TeamProfilecardTrigger>{' '}
							|||{' '}
							<TeamProfilecardTrigger
								{...defaultProps}
								actions={defaultProps.actions.slice(0, numActions)}
								trigger="hover-click"
								viewingUserId={viewerId}
							>
								<strong>Hover/click team</strong>
							</TeamProfilecardTrigger>
						</span>
					</Container>
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}

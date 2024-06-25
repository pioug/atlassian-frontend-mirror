import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored - Test file
import styled from '@emotion/styled';

import ProfileCardClient from '../../client';
import TeamProfilecardTrigger from '../../components/Team';
import { getMockTeamClient } from '../../mocks';
import { staticTeamData } from '../../mocks/team-data';
import { type Team } from '../../types';
const clientArgs = {
	cacheSize: 10,
	cacheMaxAge: 0,
	url: 'DUMMY',
	gatewayGraphqlUrl: 'https://api-private.stg.atlassian.com/graphql',
	cloudId: 'site-id',
};

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

const MockTeamClient = getMockTeamClient(teamClientData);

const mockTeamClient = new MockTeamClient(clientArgs);

const profileClient = new ProfileCardClient(clientArgs, {
	teamClient: mockTeamClient,
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

export const TeamProfileCardWithTriggerTest = () => (
	<Wrapper>
		<span>
			Hover to preview the team:{' '}
			<TeamProfilecardTrigger {...defaultProps} trigger="hover">
				<strong data-testId="trigger">The Cool Team</strong>
			</TeamProfilecardTrigger>
		</span>
	</Wrapper>
);

// As part of HOT-109153, we saw the profilecard inheriting styles from its parents
/* eslint-disable @atlaskit/ui-styling-standard/no-styled -- Intentional for test */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors -- Intentional for test */
const Wrapper = styled.div({
	a: {
		color: 'green',
	},
	fontSize: '30px',
});

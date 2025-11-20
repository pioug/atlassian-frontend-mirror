import React, { useCallback, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import Flag, { FlagGroup, type FlagProps } from '@atlaskit/flag';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import ProfileCardResourced, { type Team } from '../src';
import TeamProfilecardTrigger from '../src/components/Team';
import ProfileCardTrigger from '../src/components/User';
import teamData from '../src/mocks/team-data';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';
import { getMockProfileClient, getMockTeamClient } from './helper/util';

const styles = cssMap({
	wrap: {
		marginBottom: token('space.250', '20px'),
	},
});
const Wrap = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles.wrap}>{children}</Box>;
};

export default function Example(): React.JSX.Element {
	const [flags, setFlags] = useState<Array<FlagProps>>([]);

	const addFlag = (flag: FlagProps) => {
		setFlags((current) => [flag, ...current]);
	};

	const dismissFlag = useCallback(
		(id: string | number) => {
			setFlags((current) => current.filter((flag) => flag.id !== id));
		},
		[setFlags],
	);

	const defaultTeamData = teamData({
		headerImage: 'Picture',
		members: 15,
	});

	const myTeamData = {
		...defaultTeamData,
		id: '1a4768c5-e3cf-4e1c-907c-e9b2322ed8b7',
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

	const clientArgs = {
		cacheSize: 10,
		cacheMaxAge: 0,
		url: 'DUMMY',
		gatewayGraphqlUrl: 'https://api-private.stg.atlassian.com/graphql',
	};

	const mockTeamClient = new MockTeamClient(clientArgs);

	const mockClient = getMockProfileClient(
		10,
		0,
		{},
		{
			gatewayGraphqlUrl: 'https://api-private.stg.atlassian.com/graphql',
			url: 'DUMMY',
			productIdentifier: 'test',
		},
	);

	mockClient.teamClient = mockTeamClient;

	const mockClientForInactiveAccount = getMockProfileClient(10, 0, {
		status: 'inactive',
	});

	const defaultProps = {
		cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
		resourceClient: mockClient,
		actions: [
			{
				label: 'View profile',
				id: 'view-profile',
				callback: () => {},
			},
		],
	};

	const teamActions = [
		{
			label: 'Team Thing',
			id: 'team-thing',
			callback: () => {},
		},
		{
			label: 'Wat!',
			id: 'team-thing-1',
			callback: () => {},
		},
	];

	return (
		<ExampleWrapper>
			<MainStage>
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
						addFlag={addFlag}
					/>
				</Wrap>
				<Wrap>
					<ProfileCardTrigger
						{...defaultProps}
						userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
						addFlag={addFlag}
					>
						<strong>hover over me</strong>
					</ProfileCardTrigger>
				</Wrap>
				<Wrap>
					<ProfileCardResourced
						{...defaultProps}
						resourceClient={mockClientForInactiveAccount}
						userId="655363:3ddf0886-bc87-42aa-b1ba-32e4991e99d8"
						addFlag={addFlag}
					/>
				</Wrap>
				<Wrap>
					<TeamProfilecardTrigger
						{...defaultProps}
						teamId={teamClientData.team.id}
						actions={[]}
						trigger="click"
						viewingUserId={'viewerId'}
						addFlag={addFlag}
						viewProfileLink="/"
					>
						<strong>The Kudos Team (clickable)</strong>
					</TeamProfilecardTrigger>
				</Wrap>
				<Wrap>
					<TeamProfilecardTrigger
						{...defaultProps}
						teamId={teamClientData.team.id}
						actions={[]}
						trigger="hover"
						viewingUserId={'viewerId'}
						addFlag={addFlag}
						viewProfileLink="/"
					>
						<strong>The Kudos Team</strong>
					</TeamProfilecardTrigger>
				</Wrap>
				<Wrap>
					<TeamProfilecardTrigger
						{...defaultProps}
						teamId={teamClientData.team.id}
						actions={teamActions}
						trigger="hover"
						viewingUserId={'viewerId'}
						addFlag={addFlag}
						viewProfileLink="/"
					>
						<strong>The Kudos Team with meatballs</strong>
					</TeamProfilecardTrigger>
				</Wrap>
				<Wrap>
					<TeamProfilecardTrigger
						{...defaultProps}
						cloudId={undefined}
						teamId={teamClientData.team.id}
						actions={[]}
						trigger="hover"
						viewingUserId={'viewerId'}
						addFlag={addFlag}
						viewProfileLink="/"
					>
						<strong>The Kudos Team without site</strong>
					</TeamProfilecardTrigger>
				</Wrap>
				<FlagGroup onDismissed={dismissFlag}>
					{flags.map((flag) => (
						<Flag {...flag} />
					))}
				</FlagGroup>
			</MainStage>
		</ExampleWrapper>
	);
}

import React from 'react';

import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import Button from '@atlaskit/button/new';
import { Inline, Stack } from '@atlaskit/primitives/compiled';
import { selectField, textField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamsAppAnalyticsContext } from '../src';
import { useAnalyticsEvents } from '../src/common/utils/generated/use-analytics-events';

import { createAnalyticsWebClientMock } from './mocks/mockAnalyticsClient';

const analyticsClient = createAnalyticsWebClientMock();

const config = {
	fields: [
		selectField({
			id: 'source',
			label: 'Analytics Source',
			type: 'select',
			options: [
				{ label: 'Team Profile Screen', value: 'teamProfileScreen' },
				{ label: 'Team Profile About', value: 'teamProfileAbout' },
				{ label: 'Team Profile Card', value: 'teamProfileCard' },
				{ label: 'Team Profile Card Trigger', value: 'teamProfileCardTrigger' },
				{ label: 'Team Restore Screen', value: 'teamRestoreScreen' },
				{ label: 'Teams Page', value: 'teamsPage' },
				{ label: 'User Profile Screen', value: 'userProfileScreen' },
				{ label: 'User Menu', value: 'userMenu' },
				{ label: 'Agent Profile Screen', value: 'agentProfileScreen' },
				{ label: 'People Home', value: 'peopleHome' },
				{ label: 'Directory Screen', value: 'directoryScreen' },
				{ label: 'Directory Search Page', value: 'peopleDirectorySearchPage' },
				{ label: 'Directory Search Results', value: 'peopleDirectorySearchResultsPage' },
				{ label: 'Avatar Initials Picker', value: 'avatarInitialsPicker' },
				{ label: 'Create Team Modal', value: 'createTeamModal' },
			],
			defaultValue: 'teamProfileScreen',
		}),
		selectField({
			id: 'consumer',
			label: 'Consumer',
			type: 'select',
			options: [
				{ label: 'Embed', value: 'embed' },
				{ label: 'Standalone', value: 'standalone' },
				{ label: 'Jira', value: 'jira' },
				{ label: 'Confluence', value: 'confluence' },
				{ label: 'Atlas', value: 'atlas' },
			],
			defaultValue: 'embed',
		}),
		textField({
			id: 'testAttribute',
			label: 'Test Attribute',
			type: 'text',
			defaultValue: 'testValue',
		}),
	],
} satisfies PlaygroundConfig;

function EventButtons({ testAttribute }: { testAttribute: string }) {
	const { fireEvent } = useAnalyticsEvents();

	return (
		<Stack space="space.100">
			<Inline space="space.100">
				<Button onClick={() => fireEvent('ui.button.clicked.analyticsExample', { testAttribute })}>
					Fire UI Event
				</Button>
				<Button
					onClick={() =>
						fireEvent('operational.automation.fired.analyticsExample', { testAttribute })
					}
				>
					Fire Operational Event
				</Button>
				<Button
					onClick={() =>
						fireEvent('track.automation.triggered.analyticsExample', { testAttribute })
					}
				>
					Fire Track Event
				</Button>
				<Button
					onClick={() => fireEvent('screen.analyticsExampleScreen.viewed', { testAttribute })}
				>
					Fire Screen Event
				</Button>
			</Inline>
		</Stack>
	);
}

export default function Basic(): React.JSX.Element {
	return (
		<Playground config={config}>
			{({ source, consumer, testAttribute }) => (
				<FabricAnalyticsListeners client={analyticsClient}>
					<TeamsAppAnalyticsContext
						data={{
							attributes: { consumer },
							source,
						}}
					>
						<EventButtons testAttribute={testAttribute} />
					</TeamsAppAnalyticsContext>
				</FabricAnalyticsListeners>
			)}
		</Playground>
	);
}

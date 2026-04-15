import React, { useCallback } from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import { toggleField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamsAnchor, TeamsNavigationProvider } from '../src';

const config = {
	fields: [
		toggleField({
			id: 'forceExternalIntent',
			label: 'Force external intent',
			type: 'toggle',
			defaultValue: false,
		}),
		toggleField({
			id: 'useSpaNavigation',
			label: 'Use SPA navigation (logs to console)',
			type: 'toggle',
			defaultValue: false,
		}),
	],
} satisfies PlaygroundConfig;

export default function TeamsNavigationProviderExample() {
	return (
		<Playground config={config}>
			{({ forceExternalIntent, useSpaNavigation }) => (
				<Inner forceExternalIntent={forceExternalIntent} useSpaNavigation={useSpaNavigation} />
			)}
		</Playground>
	);
}

function Inner({
	forceExternalIntent,
	useSpaNavigation,
}: {
	forceExternalIntent: boolean;
	useSpaNavigation: boolean;
}) {
	const navigate = useCallback((url: string) => {
		// eslint-disable-next-line no-console
		console.log('SPA navigation to:', url);
	}, []);

	return (
		<TeamsNavigationProvider
			value={{
				forceExternalIntent,
				navigate: useSpaNavigation ? navigate : undefined,
			}}
		>
			<Text as="p">
				<TeamsAnchor href="/teams/my-team" intent="navigation">
					Teams anchor
				</TeamsAnchor>
			</Text>
		</TeamsNavigationProvider>
	);
}

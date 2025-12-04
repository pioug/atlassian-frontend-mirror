import React, { useCallback } from 'react';

import {
	type GetAutocompleteInitialData,
	type GetAutocompleteSuggestions,
	useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';

import {
	jqlFieldsMock,
	jqlFunctionsMock,
	jqlValuesMock,
	mockAvatarUrl,
} from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { type HydratedUser, type HydratedValues, JQLEditor } from '../src';

const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
	// Simulate fetching initial data from an API
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					jqlFields: jqlFieldsMock,
					jqlFunctions: jqlFunctionsMock,
				}),
			150,
		);
	});

const getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>
	// Simulate fetching autocomplete suggestions from an API
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					results: jqlValuesMock,
				}),
			150,
		);
	});

const onHydrate = (jql: string): Promise<HydratedValues> =>
	// Simulate fetching hydrated user data from an API including agents
	new Promise((resolve) => {
		setTimeout(() => {
			const hydratedUsers: HydratedUser[] = [];

			// Regular user (human user)
			if (jql.includes('john-doe')) {
				hydratedUsers.push({
					type: 'user',
					id: 'john-doe',
					name: 'John Doe',
					avatarUrl: mockAvatarUrl,
				});
			}

			// Agent
			if (jql.includes('agent-id')) {
				hydratedUsers.push({
					type: 'user',
					id: 'agent-id',
					name: 'AI Agent',
					avatarUrl: mockAvatarUrl,
					appType: 'agent',
				});
			}

			resolve({
				assignee: hydratedUsers,
				reporter: hydratedUsers,
			});
		}, 300);
	});

export default (): React.JSX.Element => {
	const autocompleteProvider = useAutocompleteProvider(
		'my-app',
		getAutocompleteInitialData,
		getAutocompleteSuggestions,
	);

	const onSearch = useCallback((jql: string) => {
		// Do some action on search
		console.log(jql);
	}, []);

	return (
		<Container>
			<JQLEditor
				analyticsSource={'my-app'}
				autocompleteProvider={autocompleteProvider}
				query={'assignee in (john-doe, agent-id) AND reporter in (agent-id)'}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

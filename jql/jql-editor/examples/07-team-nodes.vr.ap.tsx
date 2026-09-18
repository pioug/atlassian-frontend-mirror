import React, { useCallback } from 'react';

import type {
	GetAutocompleteInitialData,
	GetAutocompleteSuggestions,
} from '@atlaskit/jql-editor-autocomplete-rest/types';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest/use-autocomplete-provider';

import {
	jqlFieldsMock,
	jqlFunctionsMock,
	jqlValuesMock,
	mockTeamAvatarUrl,
	teams,
} from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import JQLEditor from '../src/ui';
import { type HydratedTeam, type HydratedValues } from '../src/ui/jql-editor/types';

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
	// Simulate fetching hydrated user data from an API
	new Promise((resolve) => {
		setTimeout(() => {
			const hydratedTeams = teams
				.filter((team) => jql.includes(team.value))
				.map(
					(team): HydratedTeam => ({
						type: 'team',
						id: team.value,
						name: team.displayName,
						avatarUrl: mockTeamAvatarUrl,
					}),
				);

			resolve({
				team: hydratedTeams,
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
				query={'Team[team] = tarjuedbergtlfrde'}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

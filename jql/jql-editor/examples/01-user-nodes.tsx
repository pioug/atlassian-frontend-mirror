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
	mockAvatarUrl,
	users,
} from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import JQLEditor from '../src/ui';
import { type HydratedUser, type HydratedValues } from '../src/ui/jql-editor/types';

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
			const hydratedUsers = users
				.filter((user) => jql.includes(user.value))
				.map(
					(user): HydratedUser => ({
						type: 'user',
						id: user.value,
						name: user.displayName,
						// Use empty avatar for the first user to demonstrate the alignment issue
						avatarUrl: user.value === 'rjuedbergtlfrde' ? '' : mockAvatarUrl,
					}),
				);

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
				query={
					'assignee = EMPTY AND status = 111 AND reporter in (rjuedbergtlfrde, \'iikibvcbvfnfglv\', "gvcehdrrgtvvuen")'
				}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

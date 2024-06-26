import React, { useCallback } from 'react';

import { action } from '@storybook/addon-actions';

import {
	type GetAutocompleteInitialData,
	type GetAutocompleteSuggestions,
	useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';

import { jqlFieldsMock, jqlFunctionsMock, jqlValuesMock } from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { JQLEditor } from '../src';

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

export default () => {
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
				query={'issuetype = bug order by rank'}
				locale={'en'}
				onSearch={onSearch}
				onFocus={action('onFocus')}
			/>
		</Container>
	);
};

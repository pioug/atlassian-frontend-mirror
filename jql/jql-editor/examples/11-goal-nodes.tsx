import React, { useCallback } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import {
	type GetAutocompleteInitialData,
	type GetAutocompleteSuggestions,
	useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';

import { jqlFieldsMock, jqlFunctionsMock, jqlValuesMock, goals } from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { type HydratedGoal, type HydratedValues, JQLEditor } from '../src';

const originalGetExperimentValue = FeatureGates.getExperimentValue.bind(FeatureGates);
FeatureGates.getExperimentValue = ((
	expName: string,
	param: string,
	defaultValue: unknown,
	options?: unknown,
) => {
	if (expName === 'anip-1095-goals-in-harmonised-filter' && param === 'isEnabled') {
		return true;
	}
	return originalGetExperimentValue(expName, param, defaultValue as any, options as any) as any;
}) as any;

// Unmatched routes will fall back to the network
fetchMock.config.fallbackToNetwork = true;

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
	// Simulate fetching hydrated goal data from an API
	new Promise((resolve) => {
		setTimeout(() => {
			const hydratedGoals = goals
				.filter((goal) => jql.includes(goal.value))
				.map(
					(goal): HydratedGoal => ({
						type: 'goal',
						id: goal.value,
						name: goal.displayName,
						status: goal.status,
						iconKey: goal.iconKey,
					}),
				);

			resolve({
				goals: hydratedGoals,
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
				query={'Goals[Goals] IN (PROJE2-4, PROJE2-5, PROJE2-6)'}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

import React, { useCallback } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import FeatureGates from '@atlaskit/feature-gate-js-client';
import {
	type GetAutocompleteInitialData,
	type GetAutocompleteSuggestions,
	useAutocompleteProvider,
} from '@atlaskit/jql-editor-autocomplete-rest';

import { jqlFieldsMock, jqlFunctionsMock, jqlValuesMock, projects } from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { type HydratedProject, type HydratedValues, JQLEditor } from '../src';

import emojiMockData from './__mocks__/emojiData.json';

const originalGetExperimentValue = FeatureGates.getExperimentValue.bind(FeatureGates);
FeatureGates.getExperimentValue = ((
	expName: string,
	param: string,
	defaultValue: unknown,
	options?: unknown,
) => {
	if (expName === 'projects_in_jira_eap_drop2_fast_follow_filters' && param === 'isEnabled') {
		return true;
	}
	return originalGetExperimentValue(expName, param, defaultValue as any, options as any) as any;
}) as any;

// Unmatched routes will fall back to the network
fetchMock.config.fallbackToNetwork = true;

// Mocking the emoji API endpoint
fetchMock.mock('path:/gateway/api/emoji/standard', () => emojiMockData, {
	overwriteRoutes: true,
});

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
			const hydratedProjects = projects
				.filter((project) => jql.includes(project.value))
				.map(
					(project): HydratedProject => ({
						type: 'project',
						id: project.value,
						name: project.displayName,
						...(project.iconName && { iconName: project.iconName }),
						...(project.privateProject && { privateProject: project.privateProject }),
					}),
				);

			resolve({
				project: hydratedProjects,
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
					'Project[AtlassianProject] IN ("ari:cloud:townsquare:1111:project/1111", "ari:cloud:townsquare:3333:project/3333")'
				}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

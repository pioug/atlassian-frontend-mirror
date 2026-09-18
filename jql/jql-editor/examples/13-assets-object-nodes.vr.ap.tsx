import React, { useCallback } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import { normaliseJqlString } from '@atlaskit/jql-ast/normalise-jql-string';
import {
	type GetAutocompleteInitialData,
	type GetAutocompleteSuggestions,
} from '@atlaskit/jql-editor-autocomplete-rest/types';
import { useAutocompleteProvider } from '@atlaskit/jql-editor-autocomplete-rest/use-autocomplete-provider';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags/setBooleanFeatureFlagResolver';

import { jqlFieldsMock, jqlFunctionsMock } from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import JQLEditor from '../src/ui';
import { type HydratedValue, type HydratedValues } from '../src/ui/jql-editor/types';

const exampleFeatureGateOverrides: Record<string, boolean> = {
	'orion-8274-cmdb-object-jql-values-resolver': true,
};
// eslint-disable-next-line @atlaskit/platform/no-module-level-eval -- example-only override; registers a resolver, not a flag read
setBooleanFeatureFlagResolver((flagKey: string) => exampleFeatureGateOverrides[flagKey] ?? false);

// Unmatched routes will fall back to the network
fetchMock.config.fallbackToNetwork = true;

// Not in the shared fields mock, so declared here.
const assetsField = {
	value: 'Assets',
	displayName: 'Assets',
	operators: ['=', '!=', 'in', 'not in', 'is', 'is not'],
	types: ['com.atlassian.servicedesk.cmdb.model.CmdbObjectReference'],
	searchable: 'true',
	orderable: 'true',
	auto: 'true',
};

// Inlined because VR runs without network access.
const mockObjectIconUrl =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%230C66E4'/%3E%3Cpath d='M24 10 38 18v12L24 38 10 30V18z' fill='%23FFFFFF'/%3E%3C/svg%3E";

const assetsObjects = [
	{
		value: '"ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/10"',
		displayName: 'Object 1 - DT-10',
		avatarUrl: mockObjectIconUrl,
	},
	{
		// no icon, so the avatar falls back to its placeholder
		value: '"ari:cloud:cmdb::object/ac72f855-c692-441a-8557-bb958b38f698/11"',
		displayName: 'MacBook Pro 16" - DT-11',
		avatarUrl: undefined,
	},
];

// Resolve on the next tick: Gemini does not wait for a component to settle, so a longer delay
// makes the VR snapshot capture the pre-hydration query text instead of the pills.
const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
	// Simulate fetching initial data from an API
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					jqlFields: [...jqlFieldsMock, assetsField],
					jqlFunctions: jqlFunctionsMock,
				}),
			0,
		);
	});

const getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>
	// Simulate fetching autocomplete suggestions from an API
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					results: assetsObjects,
				}),
			0,
		);
	});

const onHydrate = (jql: string): Promise<HydratedValues> =>
	// Simulate fetching hydrated Assets object data from an API
	new Promise((resolve) => {
		setTimeout(() => {
			const hydratedObjects = assetsObjects
				.filter((assetsObject) => jql.includes(assetsObject.value))
				.map(
					(assetsObject): HydratedValue => ({
						type: 'assets',
						// hydrated ids must be the unquoted operand value
						id: normaliseJqlString(assetsObject.value),
						name: assetsObject.displayName,
						avatarUrl: assetsObject.avatarUrl,
					}),
				);

			resolve({
				Assets: hydratedObjects,
			});
		}, 0);
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
				query={`Assets IN (${assetsObjects.map((assetsObject) => assetsObject.value).join(', ')})`}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

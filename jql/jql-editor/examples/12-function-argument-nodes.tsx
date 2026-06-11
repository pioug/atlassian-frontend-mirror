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
	mockTeamAvatarUrl,
} from '../examples-utils/data';
import { Container } from '../examples-utils/styled';
import { JQLEditor } from '../src';
import { type HydratedLozengeWithAvatar, type HydratedValues } from '../src/types';

const focusAreas = [
	{
		id: 'ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-111111111111',
		displayName: 'Improve Developer Experience',
		avatarUrl: mockTeamAvatarUrl,
	},
	{
		id: 'ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-222222222222',
		displayName: 'Platform Reliability',
		avatarUrl: mockTeamAvatarUrl,
	},
	{
		id: 'ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-333333333333',
		displayName: 'Customer Growth',
		avatarUrl: mockTeamAvatarUrl,
	},
];

const getAutocompleteInitialData: GetAutocompleteInitialData = () =>
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
	new Promise((resolve) => {
		setTimeout(
			() =>
				resolve({
					results: jqlValuesMock,
				}),
			150,
		);
	});

const onHydrate = (jql: string): Promise<HydratedValues> => {
	const values: HydratedLozengeWithAvatar[] = focusAreas
		.filter((fa) => jql.includes(fa.id))
		.map(
			(fa): HydratedLozengeWithAvatar => ({
				type: 'lozengeWithAvatar',
				id: fa.id,
				name: fa.displayName,
				avatarUrl: fa.avatarUrl,
			}),
		);

	return Promise.resolve({
		focusArea: values,
	});
};

export default (): React.JSX.Element => {
	const autocompleteProvider = useAutocompleteProvider(
		'my-app',
		getAutocompleteInitialData,
		getAutocompleteSuggestions,
	);

	const onSearch = useCallback((jql: string) => {
		console.log(jql);
	}, []);

	return (
		<Container>
			<p>
				<strong>UNDER() only</strong> — both clauses use function arguments
			</p>
			<JQLEditor
				analyticsSource={'my-app'}
				autocompleteProvider={autocompleteProvider}
				query={`focusArea = UNDER("ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-111111111111") AND focusArea = UNDER("ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-222222222222")`}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
			<p>
				<strong>Mixed</strong> — direct value + UNDER() on the same field with the same ARI.
			</p>
			<JQLEditor
				analyticsSource={'my-app'}
				autocompleteProvider={autocompleteProvider}
				query={`focusArea = "ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-111111111111" AND focusArea = UNDER("ari:cloud:mercury::focus-area/aaaaaaaa-bbbb-cccc-dddd-111111111111")`}
				locale={'en'}
				onSearch={onSearch}
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
		</Container>
	);
};

import React, { useEffect, useState } from 'react';

import { of } from 'rxjs/observable/of';

import type { AutocompleteProvider } from '@atlaskit/jql-editor-common/autocomplete/types';
import {
	UNSAFE_clearExperimentOverride,
	UNSAFE_overrideExperiment,
} from '@atlaskit/platform-feature-experiments/dev-override';

import { Container } from '../examples-utils/styled';
import JQLEditor from '../src/ui';
import type { HydratedFocusArea, HydratedValues } from '../src/ui/jql-editor/types';

const focusAreas: HydratedFocusArea[] = [
	{
		type: 'focusArea',
		id: 'ari:cloud:mercury:example-cloud-id:focus-area/workspace/00000000-0000-4000-8000-000000000000/00000000-0000-4000-8000-000000000001',
		name: 'Cloud Migration 2026',
	},
	{
		type: 'focusArea',
		id: 'ari:cloud:mercury:example-cloud-id:focus-area/workspace/00000000-0000-4000-8000-000000000000/00000000-0000-4000-8000-000000000002',
		name: 'Customer Experience',
	},
	{
		type: 'focusArea',
		id: 'ari:cloud:mercury:example-cloud-id:focus-area/workspace/00000000-0000-4000-8000-000000000000/00000000-0000-4000-8000-000000000003',
		name: 'Team Growth',
	},
	{
		type: 'focusArea',
		id: 'ari:cloud:mercury:example-cloud-id:focus-area/workspace/00000000-0000-4000-8000-000000000000/00000000-0000-4000-8000-000000000004',
		name: 'Platform Reliability',
	},
];

const autocompleteProvider: AutocompleteProvider = {
	onFields: () => of([]),
	onFunctions: () => of([]),
	onOperators: () => of([]),
	onValues: () =>
		of(
			focusAreas.map(({ id, name }) => ({
				name,
				value: `"${id}"`,
				valueType: 'focusArea' as const,
			})),
		),
};

const onHydrate = async (): Promise<HydratedValues> => ({ focusArea: focusAreas });

const onHydrateWithoutName = async (): Promise<HydratedValues> => ({
	focusArea: [{ ...focusAreas[0], name: '' }],
});

const onHydrateWithoutResult = async (): Promise<HydratedValues> => ({ focusArea: [] });

const onHydrateWithError = async (): Promise<HydratedValues> => {
	throw new Error('Focus Area hydration failed');
};

export default (): React.JSX.Element | null => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		UNSAFE_overrideExperiment('focus_in_jira_m1', { isEnabled: true });
		setIsReady(true);
		return () => UNSAFE_clearExperimentOverride('focus_in_jira_m1');
	}, []);

	if (!isReady) {
		return null;
	}

	return (
		<Container>
			<p>
				<strong>Resolved names</strong>
			</p>
			<JQLEditor
				analyticsSource="my-app"
				autocompleteProvider={autocompleteProvider}
				query={`focusArea IN (${focusAreas.map(({ id }) => `"${id}"`).join(', ')})`}
				locale="en"
				enableRichInlineNodes
				onHydrate={onHydrate}
			/>
			<p>
				<strong>Empty name</strong> — hydration returns an empty name, so the ARI stays as plain
				text.
			</p>
			<JQLEditor
				analyticsSource="my-app"
				autocompleteProvider={autocompleteProvider}
				query={`focusArea = "${focusAreas[0].id}"`}
				locale="en"
				enableRichInlineNodes
				onHydrate={onHydrateWithoutName}
			/>
			<p>
				<strong>No hydration result</strong> — the unresolved ARI stays as plain text.
			</p>
			<JQLEditor
				analyticsSource="my-app"
				autocompleteProvider={autocompleteProvider}
				query={`focusArea = "${focusAreas[0].id}"`}
				locale="en"
				enableRichInlineNodes
				onHydrate={onHydrateWithoutResult}
			/>
			<p>
				<strong>Hydration error</strong> — the request rejects and the ARI stays as plain text.
			</p>
			<JQLEditor
				analyticsSource="my-app"
				autocompleteProvider={autocompleteProvider}
				query={`focusArea = "${focusAreas[0].id}"`}
				locale="en"
				enableRichInlineNodes
				onHydrate={onHydrateWithError}
			/>
		</Container>
	);
};

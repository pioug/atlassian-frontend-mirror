import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoInstances from '../../examples/vr/confluence-search-config-modal-no-confluence-instances-vr';

snapshot(ConfluenceSearchConfigModalNoInstances, {
	description: 'Confluence search config modal no instances view',
	drawsOutsideBounds: true,
	ignoredErrors: [
		{
			pattern: /Warning: Can't perform a React state update on an unmounted component/,
			ignoredBecause: 'State updated on initialising hook occurred but testing error state',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
	},
});

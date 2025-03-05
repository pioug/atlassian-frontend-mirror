import { snapshot } from '@af/visual-regression';

import AssetsObjectsTable from '../../examples/vr/assets-objects-table-vr';

snapshot(AssetsObjectsTable, {
	description: 'Assets Objects Table',
	ignoredErrors: [
		{
			pattern: /^Warning: ReactDOM\.render is no longer supported in React 18\./,
			ignoredBecause: 'React-DOM needs to be updated to 18 as well, but we cannot support below 18',
			jiraIssueId: 'NONE-123',
		},
	],
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
		assets_as_an_app_v2: [true, false],
	},
});

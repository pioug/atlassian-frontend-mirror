import { snapshot } from '@af/visual-regression';

import AuthState from '../../examples/issue-like-table-3p-unauth';

snapshot(AuthState, {
	description: '3P auth empty state',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': [true, false],
		'replace-legacy-button-in-sllv': true,
	},
});

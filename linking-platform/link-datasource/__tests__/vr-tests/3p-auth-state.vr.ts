import { snapshot } from '@af/visual-regression';

import AuthState from '../../examples/issue-like-table-3p-unauth';

snapshot(AuthState, {
	description: '3P auth empty state',
	drawsOutsideBounds: true,
	featureFlags: {
		fix_a11y_violations_in_link_datasource: [true, false],
	},
});

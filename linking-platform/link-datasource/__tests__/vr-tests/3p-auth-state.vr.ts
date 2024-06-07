import { snapshot } from '@af/visual-regression';

import AuthState from '../../examples/issue-like-table-3p-unauth';

snapshot(AuthState, {
	description: '3P auth empty state',
	drawsOutsideBounds: true,
});

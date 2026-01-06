import { snapshot } from '@af/visual-regression';

import AssetsObjectsTable from '../../examples/vr/assets-objects-table-vr';

snapshot(AssetsObjectsTable, {
	description: 'Assets Objects Table',
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});

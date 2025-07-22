import { snapshot } from '@af/visual-regression';

import AssetsObjectsTable from '../../examples/vr/assets-objects-table-vr';

snapshot(AssetsObjectsTable, {
	description: 'Assets Objects Table',
	featureFlags: {
		assets_as_an_app_v2: [true, false],
	},
});

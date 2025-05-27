import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalUnauthEdit from '../../examples/vr/confluence-search-config-modal-unauth-edit-vr';

snapshot(ConfluenceSearchConfigModalUnauthEdit, {
	description: 'Confluence search config modal unauthorized edit view',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-linking-visual-refresh-sllv': true,
		'replace-legacy-button-in-sllv': [false, true],
	},
});

import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoResults from '../../examples/vr/confluence-search-config-modal-no-results-vr';

snapshot(ConfluenceSearchConfigModalNoResults, {
	description: 'Confluence search config modal no results view',
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-update-sllv-icons': [true, false],
		'platform-linking-visual-refresh-sllv': [true, false],
	},
});

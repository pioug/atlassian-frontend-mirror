import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoResults from '../../examples/vr/confluence-search-config-modal-no-results-vr';

snapshot(ConfluenceSearchConfigModalNoResults, {
	description: 'Confluence search config modal no results view',
	drawsOutsideBounds: true,
	featureFlags: {
		'replace-legacy-button-in-sllv': true,
	},
});

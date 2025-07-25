import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalInitialResults from '../../examples/vr/confluence-search-config-modal-initial-results-vr';

snapshot(ConfluenceSearchConfigModalInitialResults, {
	description: 'Confluence search config modal initial results view',
	drawsOutsideBounds: true,
	featureFlags: {
		'replace-legacy-button-in-sllv': true,
	},
});

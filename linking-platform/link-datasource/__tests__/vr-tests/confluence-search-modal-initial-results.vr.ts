import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalInitialResults from '../../examples/vr/confluence-search-config-modal-initial-results-vr';

snapshot(ConfluenceSearchConfigModalInitialResults, {
	description: 'Confluence search config modal initial results view',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1895-new-logo-design': [true, false],
	},
});

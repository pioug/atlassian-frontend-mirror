import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoResults from '../../examples/vr/confluence-search-config-modal-no-results-vr';

snapshot(ConfluenceSearchConfigModalNoResults, {
	description: 'Confluence search config modal no results view',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});

import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoInstances from '../../examples/vr/confluence-search-config-modal-no-confluence-instances-vr';

snapshot(ConfluenceSearchConfigModalNoInstances, {
	description: 'Confluence search config modal no instances view',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});

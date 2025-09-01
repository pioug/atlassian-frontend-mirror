import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoDisplayDropdown from '../../examples/vr/confluence-search-config-modal-no-display-dropdown-vr';

snapshot(ConfluenceSearchConfigModalNoDisplayDropdown, {
	description: 'Confluence search config modal without display dropdown',
	drawsOutsideBounds: true,
	featureFlags: {
		'navx-1483-a11y-close-button-in-modal-updates': true,
	},
});

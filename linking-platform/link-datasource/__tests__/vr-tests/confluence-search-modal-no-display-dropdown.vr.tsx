import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoDisplayDropdown from '../../examples/vr/confluence-search-config-modal-no-display-dropdown-vr';

snapshot(ConfluenceSearchConfigModalNoDisplayDropdown, {
	description: 'Confluence search config modal without display dropdown',
	drawsOutsideBounds: true,
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
	},
});

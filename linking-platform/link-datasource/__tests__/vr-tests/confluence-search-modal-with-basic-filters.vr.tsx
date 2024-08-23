import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoInitialSearch from '../../examples/vr/confluence-search-config-modal-no-initial-search-vr';

snapshot(ConfluenceSearchConfigModalNoInitialSearch, {
	description: 'Confluence search config modal with basic filters',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform.linking-platform.datasource.show-clol-basic-filters': true,
		'platform-datasources-use-refactored-config-modal': [true, false],
	},
});

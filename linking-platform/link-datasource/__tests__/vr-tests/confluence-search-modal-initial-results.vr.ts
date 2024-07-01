import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalInitialResults from '../../examples/vr/confluence-search-config-modal-initial-results-vr';

snapshot(ConfluenceSearchConfigModalInitialResults, {
	description: 'Confluence search config modal initial results view',
	drawsOutsideBounds: true,
});

snapshot(ConfluenceSearchConfigModalInitialResults, {
	description:
		'Confluence search config modal initial results view with total count as asingle string',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform.linking-platform.datasource.total-count-i18n-single-key': true,
	},
});

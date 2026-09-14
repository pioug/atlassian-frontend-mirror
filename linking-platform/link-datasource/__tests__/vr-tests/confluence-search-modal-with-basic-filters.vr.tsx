import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoInitialSearch from '../../examples/vr/confluence-search-config-modal-no-initial-search-vr.vr.ap';

snapshot(ConfluenceSearchConfigModalNoInitialSearch, {
	description: 'Confluence search config modal with basic filters',
	drawsOutsideBounds: true,
});

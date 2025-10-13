import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoInitialSearch from '../../examples/vr/confluence-search-config-modal-no-initial-search-vr';

snapshot(ConfluenceSearchConfigModalNoInitialSearch, {
	description: 'Confluence search config modal no initial search',
	drawsOutsideBounds: true,
});

import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalInitialResults from '../../examples/vr/confluence-search-config-modal-initial-results-vr.vr.ap';

snapshot(ConfluenceSearchConfigModalInitialResults, {
	description: 'Confluence search config modal initial results view',
	drawsOutsideBounds: true,
});

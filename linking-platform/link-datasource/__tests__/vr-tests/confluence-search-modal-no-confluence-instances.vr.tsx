import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalNoInstances from '../../examples/vr/confluence-search-config-modal-no-confluence-instances-vr.vr.ap';

snapshot(ConfluenceSearchConfigModalNoInstances, {
	description: 'Confluence search config modal no instances view',
	drawsOutsideBounds: true,
});

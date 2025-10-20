import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalDisableSiteSelector from '../../examples/vr/confluence-search-config-modal-disable-site-selector-vr';

snapshot(ConfluenceSearchConfigModalDisableSiteSelector, {
	description: 'Confluence search config modal with disabled site selector',
	drawsOutsideBounds: true,
});

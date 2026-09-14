import { snapshot } from '@af/visual-regression';

import ConfluenceSearchConfigModalUnauthEdit from '../../examples/vr/confluence-search-config-modal-unauth-edit-vr.vr.ap';

snapshot(ConfluenceSearchConfigModalUnauthEdit, {
	description: 'Confluence search config modal unauthorized edit view',
	drawsOutsideBounds: true,
});

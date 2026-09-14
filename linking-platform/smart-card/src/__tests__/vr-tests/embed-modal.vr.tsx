import { snapshot } from '@af/visual-regression';

import EmbedModalConfluence from '../../../examples/vr-embed-modal/vr-embed-modal-confluence.vr.ap';
import EmbedModalWithFlexibleUiIcon from '../../../examples/vr-embed-modal/vr-embed-modal-with-flexible-ui-icon.vr.ap';
import EmbedModal from '../../../examples/vr-embed-modal/vr-embed-modal.vr.ap';

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedModal, {
	description: 'renders embed modal',
});

snapshot(EmbedModalWithFlexibleUiIcon, {
	description: 'renders embed modal with flexible ui icon',
});

// Will be re-enabled as part of UTEST-2316.
snapshot.skip(EmbedModalConfluence, {
	description: 'renders embed modal with Confluence icon',
});

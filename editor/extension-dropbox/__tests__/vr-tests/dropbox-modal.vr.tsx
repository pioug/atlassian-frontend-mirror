import { snapshot } from '@af/visual-regression';

import DropboxModalOpen from '../../examples/dropbox-modal.vr.ap';

snapshot(DropboxModalOpen, {
	description: 'Dropbox modal title',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform_dst_modal-dialog-use-modal-title': [true, false],
	},
});

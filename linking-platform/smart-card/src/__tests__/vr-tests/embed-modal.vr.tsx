import { snapshot } from '@af/visual-regression';

import EmbedModal from '../../../examples/vr-embed-modal/vr-embed-modal';
import EmbedModalConfluence from '../../../examples/vr-embed-modal/vr-embed-modal-confluence';
import EmbedModalWithFlexibleUiIcon from '../../../examples/vr-embed-modal/vr-embed-modal-with-flexible-ui-icon';

snapshot(EmbedModal, {
	description: 'renders embed modal',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

snapshot(EmbedModalWithFlexibleUiIcon, {
	description: 'renders embed modal with flexible ui icon',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

snapshot(EmbedModalConfluence, {
	description: 'renders embed modal with Confluence icon',
	featureFlags: {
		'platform-linking-visual-refresh-v1': [true, false],
		'platform-smart-card-remove-legacy-button': [true, false],
	},
});

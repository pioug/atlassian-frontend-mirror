import { snapshot } from '@af/visual-regression';

import WithAssetsModalObjectReferenceVR from '../../../../../examples/vr/with-assets-modal-object-reference-vr.vr.ap';
import WithAssetsModalVR from '../../../../../examples/vr/with-assets-modal-vr.vr.ap';

snapshot(WithAssetsModalVR, {
	description: 'display assets modal',
	drawsOutsideBounds: true,
});

snapshot(WithAssetsModalObjectReferenceVR, {
	description: 'display assets modal with object reference',
	drawsOutsideBounds: true,
	featureFlags: {
		astral_assets_macro_table_ui_uplift: true,
	},
});

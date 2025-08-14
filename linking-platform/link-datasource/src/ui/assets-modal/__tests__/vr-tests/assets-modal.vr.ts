import { snapshot } from '@af/visual-regression';

import WithAssetsModalVR from '../../../../../examples/vr/with-assets-modal-vr';

snapshot(WithAssetsModalVR, {
	description: 'display assets modal',
	drawsOutsideBounds: true,
	featureFlags: {},
});

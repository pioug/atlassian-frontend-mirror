import { snapshot } from '@af/visual-regression';

import ConnectSuccessFlag from '../../../examples/vr-flag/vr-connect-success-flag';

snapshot(ConnectSuccessFlag, {
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-shape-theme-default': [true, false],
	},
});

import { snapshot } from '@af/visual-regression';

import ConnectSuccessFlag from '../../../examples/vr-flag/vr-connect-success-flag';

snapshot(ConnectSuccessFlag, {
	drawsOutsideBounds: true,
	featureFlags: {
		platform_sl_connect_account_flag: true,
		'platform-dst-shape-theme-default': [true, false],
	},
});

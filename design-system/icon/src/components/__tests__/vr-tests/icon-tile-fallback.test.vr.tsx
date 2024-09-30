import { snapshot } from '@af/visual-regression';

import Example from '../../../../examples/vr/vr-icon-tile-fallback';

snapshot(Example, {
	featureFlags: {
		'platform.design-system-team.enable-new-icons': [true, false],
	},
});

import { snapshot } from '@af/visual-regression';

import FlexibleCardAction from '../../../examples/vr-flexible-card/vr-flexible-ui-action';

snapshot(FlexibleCardAction, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

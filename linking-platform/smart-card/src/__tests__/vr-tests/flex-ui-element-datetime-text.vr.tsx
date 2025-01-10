import { snapshot } from '@af/visual-regression';

import FlexUiDateTimeTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-text-and-date';

snapshot(FlexUiDateTimeTextView, {
	featureFlags: {
		'bandicoots-compiled-migration-smartcard': [true, false],
	},
});

import { snapshot } from '@af/visual-regression';

import FlexUiDateTimeTextView from '../../../examples/vr-flexible-card/vr-flexible-ui-element-text-and-date';

snapshot(FlexUiDateTimeTextView, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

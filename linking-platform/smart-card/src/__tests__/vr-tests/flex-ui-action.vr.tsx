import { snapshot } from '@af/visual-regression';

import FlexibleCardAction from '../../../examples/vr-flexible-card/vr-flexible-ui-action';

snapshot(FlexibleCardAction, {
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
	waitForReactLazy: true,
});

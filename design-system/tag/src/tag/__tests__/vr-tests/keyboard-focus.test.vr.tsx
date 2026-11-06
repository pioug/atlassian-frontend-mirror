import { snapshot } from '@af/visual-regression';

import KeyboardFocus from '../../../../examples/vr-tests/keyboard-focus.vr.ap';

snapshot(KeyboardFocus, {
	description: 'keyboard-focus-without-margin',
	featureFlags: {
		'platform-dst-motion-uplift-labels': true,
		prefetch_nin_resources_on_user_intent_m2: true,
	},
	states: [
		{
			selector: { byTestId: 'keyboard-focus--link' },
			state: 'focused',
		},
	],
	variants: [{ name: 'light', environment: { colorScheme: 'light' } }],
});

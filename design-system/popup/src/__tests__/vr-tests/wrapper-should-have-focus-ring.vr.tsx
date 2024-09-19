import { snapshot } from '@af/visual-regression';

import Popup from '../../../examples/popup-opened-onkeydown';

snapshot(Popup, {
	featureFlags: {
		'platform-design-system-apply-popup-wrapper-focus': true,
	},
	drawsOutsideBounds: true,
	variants: [
		{
			name: 'Light',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

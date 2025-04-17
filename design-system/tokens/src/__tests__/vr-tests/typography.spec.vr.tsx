import { Device, snapshot } from '@af/visual-regression';

import TypographyVr from '../../../examples/5-typography-vr';

snapshot(TypographyVr, {
	variants: [
		{
			name: 'desktop chrome',
			environment: {},
			device: Device.DESKTOP_CHROME,
		},
		{
			name: 'mobile chrome',
			environment: {},
			device: Device.MOBILE_CHROME,
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
	},
});

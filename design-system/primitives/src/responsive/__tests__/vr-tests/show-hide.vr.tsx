import { Device, snapshot } from '@af/visual-regression';

import ShowHideExample from '../../../../examples/51-responsive-show-hide';

snapshot(ShowHideExample, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic.vr.ap';
import Appearance from '../../../examples/1-appearance.vr.ap';
import Resize from '../../../examples/2-resize.vr.ap';

snapshot(Basic, {
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

snapshot(Appearance);
snapshot(Resize);

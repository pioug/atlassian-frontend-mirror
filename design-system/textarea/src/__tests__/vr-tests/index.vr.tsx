import { Device, snapshot } from '@af/visual-regression';

import Basic from '../../../examples/0-basic.vr.ap';
import Appearance from '../../../examples/1-appearance.vr.ap';
import Resize from '../../../examples/2-resize.vr.ap';

const inputMotionFeatureFlags = {
	'platform-dst-motion-uplift-input': [true],
};

snapshot(Basic, {
	variants: [
		{
			name: 'mobile chrome',
			device: Device.MOBILE_CHROME,
		},
		{
			name: 'mobile webkit',
			device: Device.MOBILE_WEBKIT,
		},
		{
			name: 'desktop chrome',
			device: Device.DESKTOP_CHROME,
		},
	],
});

snapshot(Basic, {
	description: 'input motion - hovered',
	states: [{ state: 'hovered', selector: { byTestId: 'minimumRowsTextArea' } }],
	featureFlags: inputMotionFeatureFlags,
	variants: [{ name: 'desktop chrome', device: Device.DESKTOP_CHROME }],
});

snapshot(Basic, {
	description: 'input motion - focused',
	states: [{ state: 'focused', selector: { byTestId: 'minimumRowsTextArea' } }],
	featureFlags: inputMotionFeatureFlags,
	variants: [{ name: 'desktop chrome', device: Device.DESKTOP_CHROME }],
});

snapshot(Appearance);
snapshot(Resize);

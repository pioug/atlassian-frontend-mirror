import { Device, snapshot } from '@af/visual-regression';

import Variations from '../../../examples/01-variations.vr.ap';

snapshot(Variations, {
	description: 'atomic styles',
	featureFlags: { 'platform-textfield-atomic-styles': [true] },
	variants: [{ name: 'desktop', device: Device.DESKTOP_CHROME }],
});

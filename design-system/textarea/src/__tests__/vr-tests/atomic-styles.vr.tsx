import { Device, snapshot } from '@af/visual-regression';

import States from '../../../examples/atomic-styles.vr.ap';

snapshot(States, {
	description: 'atomic styles states',
	featureFlags: { 'platform-textarea-atomic-styles': [true] },
	variants: [{ name: 'desktop', device: Device.DESKTOP_CHROME }],
});

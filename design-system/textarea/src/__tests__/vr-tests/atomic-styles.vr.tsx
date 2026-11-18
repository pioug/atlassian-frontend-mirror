import { Device, snapshot } from '@af/visual-regression';

import States from '../../../examples/atomic-styles.vr.ap';

snapshot(States, {
	description: 'atomic styles states',
	variants: [{ name: 'desktop', device: Device.DESKTOP_CHROME }],
});

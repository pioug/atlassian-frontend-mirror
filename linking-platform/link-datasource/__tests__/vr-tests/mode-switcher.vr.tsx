import { snapshot } from '@af/visual-regression';

import ModeSwitcher from '../../examples/vr/mode-switcher-vr.vr.ap';

snapshot(ModeSwitcher, {
	description: 'Mode switcher',
	featureFlags: {},
});

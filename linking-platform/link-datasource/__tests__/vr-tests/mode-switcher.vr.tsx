import { snapshot } from '@af/visual-regression';

import ModeSwitcher from '../../examples/vr/mode-switcher-vr';

snapshot(ModeSwitcher, {
	description: 'Mode switcher',
	featureFlags: {
		'bandicoots-compiled-migration-link-datasource': [true, false],
	},
});

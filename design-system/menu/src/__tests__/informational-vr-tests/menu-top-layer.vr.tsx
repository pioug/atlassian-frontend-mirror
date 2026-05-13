import { snapshotInformational } from '@af/visual-regression';

import MenuGroup from '../../../examples/05-menu-group';

const topLayerFlag = {
	'platform-dst-top-layer': [true, false],
} as const;

snapshotInformational(MenuGroup, {
	description: 'menu group with top-layer flag',
	featureFlags: topLayerFlag,
});

snapshotInformational(MenuGroup, {
	description: 'popup menu group hovered with top-layer flag',
	featureFlags: topLayerFlag,
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'mock-starred-menu' },
		},
	],
});

import { snapshot } from '@af/visual-regression';

import MenuGroup from '../../../../examples/05-menu-group';

snapshot(MenuGroup);
snapshot(MenuGroup, {
	description: 'Should match the PopupMenuGroup when hovered',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'mock-starred-menu' },
		},
	],
});
snapshot(MenuGroup, {
	description: 'Should match the adjacent sections menu',
	states: [
		{
			state: 'focused',
			selector: { byTestId: 'favourite-articles-button-item' },
		},
	],
});

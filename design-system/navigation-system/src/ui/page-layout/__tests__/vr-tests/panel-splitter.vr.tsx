import { snapshot } from '@af/visual-regression';

import {
	PanelSplitterPositionEnd,
	PanelSplitterPositionStart,
} from '../../../../../examples/panel-splitter';

snapshot(PanelSplitterPositionStart, {
	description: 'Hovered panel splitter with position: start',
	featureFlags: {
		platform_nav4_panel_splitter_keyboard_a11y: [true, false],
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'panel-splitter',
			},
		},
	],
});

snapshot(PanelSplitterPositionEnd, {
	description: 'Hovered panel splitter with position: end',
	featureFlags: {
		platform_nav4_panel_splitter_keyboard_a11y: [true, false],
	},
	states: [
		{
			state: 'hovered',
			selector: {
				byTestId: 'panel-splitter',
			},
		},
	],
});

snapshot(PanelSplitterPositionStart, {
	description: 'Focused panel splitter with position: start',
	featureFlags: {
		platform_nav4_panel_splitter_keyboard_a11y: true,
	},
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'slider',
				options: {
					name: 'Resize panel',
				},
			},
		},
	],
});

snapshot(PanelSplitterPositionEnd, {
	description: 'Focused panel splitter with position: end',
	featureFlags: {
		platform_nav4_panel_splitter_keyboard_a11y: true,
	},
	states: [
		{
			state: 'focused',
			selector: {
				byRole: 'slider',
				options: {
					name: 'Resize panel',
				},
			},
		},
	],
});

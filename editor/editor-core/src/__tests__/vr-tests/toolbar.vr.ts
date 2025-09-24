import { Device, snapshot } from '@af/visual-regression';

import { EditorToolbarWithIconBefore } from './toolbar.fixtures';

snapshot(EditorToolbarWithIconBefore, {
	description: 'Toolbar with icon before',
	featureFlags: {
		platform_editor_prevent_toolbar_width_reflow: true,
	},
	variants: [
		{
			device: Device.DESKTOP_CHROME,
			name: 'desktop',
		},
		{
			device: Device.MOBILE_CHROME,
			name: 'mobile',
		},
	],
});

import { Device, snapshot } from '@af/visual-regression';
import { flagsForVrTestsWithReducedPadding } from '@atlaskit/editor-test-helpers/advanced-layouts-flags';

import {
	PanelRenderer,
	PanelRendererWithReactLooselyLazy,
	PanelRendererNestedInTable,
	PanelFullPageRenderer,
} from './panel.fixture';

snapshot(PanelRenderer);
snapshot(PanelRendererWithReactLooselyLazy);
snapshot(PanelRendererNestedInTable, {
	featureFlags: {
		platform_editor_bordered_panel_nested_in_table: [true, false],
	},
});

snapshot(PanelFullPageRenderer, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-page renderer should have 24px padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

snapshot(PanelRenderer, {
	...flagsForVrTestsWithReducedPadding,
	description: 'full-width renderer should have no padding on narrow screen',
	variants: [
		{
			name: 'mobile device',
			device: Device.MOBILE_CHROME,
		},
	],
});

import { snapshot } from '@af/visual-regression';

import {
	PanelRenderer,
	PanelRendererWithReactLooselyLazy,
	PanelRendererNestedInTable,
} from './panel.fixture';

snapshot(PanelRenderer);
snapshot(PanelRendererWithReactLooselyLazy);
snapshot(PanelRendererNestedInTable, {
	featureFlags: {
		platform_editor_bordered_panel_nested_in_table: [true, false],
	},
});

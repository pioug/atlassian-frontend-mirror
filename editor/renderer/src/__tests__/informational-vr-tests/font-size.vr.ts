import { snapshotInformational } from '@af/visual-regression';

import { SmallTextInNestedBlocksRenderer } from './font-size.fixture';

snapshotInformational(SmallTextInNestedBlocksRenderer, {
	description:
		'should render small text without extra top margin inside table cells, panels, and list items',
	featureFlags: {
		platform_editor_small_font_size: true,
	},
});

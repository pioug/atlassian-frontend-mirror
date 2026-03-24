import { snapshot } from '@af/visual-regression';

import {
	HiddenMarkersListCommentRenderer,
	HiddenMarkersListRenderer,
} from './hidden-markers-list.fixture';

snapshot(HiddenMarkersListRenderer, {
	description: 'hidden markers list should not show markers in full-page renderer',
	featureFlags: {
		platform_editor_flexible_list_schema: true,
	},
});

snapshot(HiddenMarkersListCommentRenderer, {
	description: 'hidden markers list should not show markers in comment renderer',
	featureFlags: {
		platform_editor_flexible_list_schema: true,
	},
});

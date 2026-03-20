import { snapshot } from '@af/visual-regression';

import {
	HiddenMarkersMixedListCommentRenderer,
	HiddenMarkersMixedListRenderer,
} from './hidden-markers-mixed-list.fixture';

snapshot(HiddenMarkersMixedListRenderer, {
	description: 'hidden markers mixed list should show task checkboxes in full-page renderer',
	featureFlags: {
		platform_editor_flexible_list_indentation: true,
	},
});

snapshot(HiddenMarkersMixedListCommentRenderer, {
	description: 'hidden markers mixed list should show task checkboxes in comment renderer',
	featureFlags: {
		platform_editor_flexible_list_indentation: true,
	},
});

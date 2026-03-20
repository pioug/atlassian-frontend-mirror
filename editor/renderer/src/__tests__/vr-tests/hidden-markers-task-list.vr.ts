import { snapshot } from '@af/visual-regression';

import {
	HiddenMarkersTaskListCommentRenderer,
	HiddenMarkersTaskListRenderer,
} from './hidden-markers-task-list.fixture';

snapshot(HiddenMarkersTaskListRenderer, {
	description: 'hidden markers task list should not show checkboxes in full-page renderer',
	featureFlags: {
		platform_editor_flexible_list_indentation: true,
	},
});

snapshot(HiddenMarkersTaskListCommentRenderer, {
	description: 'hidden markers task list should not show checkboxes in comment renderer',
	featureFlags: {
		platform_editor_flexible_list_indentation: true,
	},
});

import { snapshot } from '@af/visual-regression';

import { EmptyCommentEditor } from './comment-appearance.fixtures';

snapshot(EmptyCommentEditor, {
	featureFlags: {
		platform_editor_usesharedpluginstateselector: [true, false],
	},
});

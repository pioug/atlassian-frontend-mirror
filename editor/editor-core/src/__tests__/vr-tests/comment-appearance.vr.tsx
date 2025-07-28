import { snapshot } from '@af/visual-regression';

import { EmptyCommentEditor, CommentEditorTwoLineToolbar } from './comment-appearance.fixtures';

snapshot(EmptyCommentEditor, {
	featureFlags: {
		platform_editor_usesharedpluginstatewithselector: [true, false],
	},
});

snapshot(CommentEditorTwoLineToolbar);

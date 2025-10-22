import { snapshot } from '@af/visual-regression';

import { EmptyCommentEditor, CommentEditorTwoLineToolbar } from './comment-appearance.fixtures';

snapshot(EmptyCommentEditor, {
	description: 'empty comment editor',
	featureFlags: {
		platform_editor_comments_border_radius: false,
	},
});

snapshot(EmptyCommentEditor, {
	description: 'empty comment editor with border radius',
	featureFlags: {
		platform_editor_comments_border_radius: true,
	},
});

snapshot(CommentEditorTwoLineToolbar, {
	description: 'comment editor two line toolbar',
	featureFlags: {
		platform_editor_comments_border_radius: false,
	},
});

snapshot(CommentEditorTwoLineToolbar, {
	description: 'comment editor two line toolbar with border radius',
	featureFlags: {
		platform_editor_comments_border_radius: true,
	},
});

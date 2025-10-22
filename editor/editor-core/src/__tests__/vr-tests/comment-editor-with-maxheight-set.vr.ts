import { snapshot } from '@af/visual-regression';

import { CommentEditorWithMaxHeight } from './comment-editor-with-maxheight-set.fixtures';

snapshot(CommentEditorWithMaxHeight, {
	description: 'comment editor with max height',
	featureFlags: {
		platform_editor_comments_border_radius: false,
	},
});

snapshot(CommentEditorWithMaxHeight, {
	description: 'comment editor with max height and border radius',
	featureFlags: {
		platform_editor_comments_border_radius: true,
	},
});

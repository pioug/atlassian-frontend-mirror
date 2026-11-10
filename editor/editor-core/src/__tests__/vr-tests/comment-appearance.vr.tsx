import { snapshot } from '@af/visual-regression';

import {
	EmptyCommentEditor,
	CommentEditorTwoLineToolbar,
} from './comment-appearance.fixtures.vr.ap';

snapshot(EmptyCommentEditor, {
	description: 'empty comment editor',
});

snapshot(CommentEditorTwoLineToolbar, {
	description: 'comment editor two line toolbar',
});

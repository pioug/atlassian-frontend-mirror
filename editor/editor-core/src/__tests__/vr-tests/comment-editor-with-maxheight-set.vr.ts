import { snapshot } from '@af/visual-regression';

import { CommentEditorWithMaxHeight } from './comment-editor-with-maxheight-set.fixtures.vr.ap';

snapshot(CommentEditorWithMaxHeight, {
	description: 'comment editor with max height',
});

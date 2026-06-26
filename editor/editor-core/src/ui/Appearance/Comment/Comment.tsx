import { componentWithCondition } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { CommentEditorWithIntlCompiled } from './Comment-compiled';
import { CommentEditorWithIntlEmotion } from './Comment-emotion';

export const CommentEditorWithIntl: typeof CommentEditorWithIntlCompiled = componentWithCondition(
	() => expValEquals('platform_editor_core_non_ecc_static_css', 'isEnabled', true),
	CommentEditorWithIntlCompiled,
	CommentEditorWithIntlEmotion,
) as typeof CommentEditorWithIntlCompiled;

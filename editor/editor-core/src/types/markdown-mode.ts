import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type MarkdownModeView = 'syntax' | 'wysiwyg' | 'preview';

export type MarkdownModePlugin = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			setView: (view: MarkdownModeView) => void;
		};
		sharedState: {
			isMarkdownMode: boolean;
			view: MarkdownModeView;
		};
	}
>;

import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

export type MarkdownModeView = 'syntax' | 'split-view' | 'preview';

export type MarkdownModePlugin = NextEditorPlugin<
	'markdownMode',
	{
		actions: {
			setView: (view: MarkdownModeView) => void;
		};
		sharedState: {
			isLivePage?: boolean;
			isMarkdownMode: boolean;
			view: MarkdownModeView;
		};
	}
>;

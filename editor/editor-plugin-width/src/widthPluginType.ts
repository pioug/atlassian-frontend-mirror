import type { EditorContainerWidth, NextEditorPlugin } from '@atlaskit/editor-common/types';

export type WidthPlugin = NextEditorPlugin<
	'width',
	{
		sharedState: EditorContainerWidth | undefined;
	}
>;

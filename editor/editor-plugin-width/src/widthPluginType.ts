import type { EditorContainerWidth } from '@atlaskit/editor-common/types/editor-container-width';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

export type WidthPlugin = NextEditorPlugin<
	'width',
	{
		sharedState: EditorContainerWidth | undefined;
	}
>;

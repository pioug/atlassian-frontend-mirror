import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

export type CompositionState = {
	isComposing: boolean;
};

export type CompositionPlugin = NextEditorPlugin<
	'composition',
	{
		sharedState: CompositionState;
	}
>;

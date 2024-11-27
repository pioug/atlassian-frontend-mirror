import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export type CompositionState = {
	isComposing: boolean;
};

export type CompositionPlugin = NextEditorPlugin<
	'composition',
	{
		sharedState: CompositionState;
	}
>;

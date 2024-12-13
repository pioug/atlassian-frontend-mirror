import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

export interface HistoryPluginState {
	canUndo: boolean;
	canRedo: boolean;
}

export type HistoryPlugin = NextEditorPlugin<
	'history',
	{
		sharedState: HistoryPluginState | undefined;
	}
>;

import type { SelectionSharedState } from '@atlaskit/editor-common/selection';
import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { EditorSelectionAPI, SelectionPluginOptions } from './types';

export type SelectionPlugin = NextEditorPlugin<
	'selection',
	{
		pluginConfiguration: SelectionPluginOptions | undefined;
		actions: EditorSelectionAPI;
		commands: {
			displayGapCursor: (toggle: boolean) => EditorCommand;
		};
		sharedState: SelectionSharedState;
	}
>;

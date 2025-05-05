import type { SelectionSharedState } from '@atlaskit/editor-common/selection';
import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';

import type { EditorSelectionAPI, SelectionPluginOptions } from './types';

export type SelectionPlugin = NextEditorPlugin<
	'selection',
	{
		pluginConfiguration: SelectionPluginOptions | undefined;
		actions: EditorSelectionAPI;
		dependencies: [OptionalPlugin<InteractionPlugin>];
		commands: {
			displayGapCursor: (toggle: boolean) => EditorCommand;
			clearManualSelection: () => EditorCommand;
			setManualSelection: (anchor: number, head: number) => EditorCommand;
		};
		sharedState: SelectionSharedState;
	}
>;

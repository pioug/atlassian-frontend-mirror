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
		actions: EditorSelectionAPI;
		commands: {
			clearManualSelection: () => EditorCommand;
			displayGapCursor: (toggle: boolean) => EditorCommand;
			hideCursor: (hide: boolean) => EditorCommand;
			setManualSelection: (anchor: number, head: number) => EditorCommand;
		};
		dependencies: [OptionalPlugin<InteractionPlugin>];
		pluginConfiguration: SelectionPluginOptions | undefined;
		sharedState: SelectionSharedState;
	}
>;

import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history/historyPluginType';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead/type-ahead-plugin-type';

import type { InputSource } from './pm-plugins/enums';

export type UndoRedoAction = (inputSource?: InputSource) => boolean;

export type UndoRedoPlugin = NextEditorPlugin<
	'undoRedoPlugin',
	{
		actions: {
			redo: UndoRedoAction;
			undo: UndoRedoAction;
		};
		dependencies: [
			TypeAheadPlugin,
			HistoryPlugin,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<ToolbarPlugin>,
		];
		pluginConfiguration:
			| {
					/**
					 * Determines whether or not to show the toolbar buttons
					 * If not it just allows use of the actions + keybindings + analytics etc.
					 * Defaults to true
					 */
					showToolbarButton: boolean;
			  }
			| undefined;
	}
>;

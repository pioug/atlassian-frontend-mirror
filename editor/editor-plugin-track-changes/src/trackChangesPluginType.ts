import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import { type PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { ShowDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';

export type TrackChangesPlugin = NextEditorPlugin<
	'trackChanges',
	{
		commands: {
			/**
			 * Toggles the displaying of changes in the editor.
			 */
			toggleChanges: EditorCommand;
			/**
			 * Resets the baseline used for tracking changes in the editor.
			 */
			resetBaseline: EditorCommand;
		};
		dependencies: [
			/**
			 * Primary toolbar plugin for registering the track changes button.
			 */
			OptionalPlugin<PrimaryToolbarPlugin>,
			/**
			 * For ensuring the tracked changes align with the history
			 */
			OptionalPlugin<HistoryPlugin>,
			/**
			 * Show diff plugin for showing the changes in a diff view.
			 */
			ShowDiffPlugin,
			/*
			 * Toolbar plugin for registering the track changes button. Will be replacing the Primary Toolbar Plugin
			 */
			OptionalPlugin<ToolbarPlugin>,
		];
		pluginConfiguration?: {
			/**
			 * Whether the track changes button should be shown on the toolbar.
			 * Defaults to false.
			 */
			showOnToolbar?: boolean;
		};
		sharedState: {
			/**
			 * Whether the track changes feature is currently displaying changes.
			 * Defaults to false.
			 */
			isDisplayingChanges: boolean;
			/**
			 * If there are changes in the document that determine if track changes button
			 * should be enabled.
			 * This will only be false initially before any changes in the session.
			 */
			isShowDiffAvailable: boolean;
		};
	}
>;

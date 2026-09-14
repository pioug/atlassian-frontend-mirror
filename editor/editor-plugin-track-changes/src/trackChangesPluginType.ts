import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { HistoryPlugin } from '@atlaskit/editor-plugin-history';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';
import type { ShowDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';

export interface TrackChangesPluginOptions {
	/**
	 * Custom wrapper component for the track changes button.
	 */
	ButtonWrapper?: React.ComponentType<{ children: React.ReactNode }>;
	/**
	 * Whether the track changes button should be shown on the toolbar.
	 * Defaults to false.
	 */
	showOnToolbar?: boolean;
}

export type TrackChangesPlugin = NextEditorPlugin<
	'trackChanges',
	{
		commands: {
			/**
			 * Resets the baseline used for tracking changes in the editor.
			 */
			resetBaseline: EditorCommand;
			/**
			 * Disables (or re-enables) the ability to toggle track changes.
			 *
			 * Intended for other plugins that temporarily own the diff decorations — for example
			 * the AI Review moment — so the toolbar button and keyboard shortcut don't fight over
			 * the same diff. While disabled the toolbar button renders in a disabled state and
			 * `toggleChanges` becomes a no-op.
			 *
			 * Callers are responsible for re-enabling (passing `false`) once they are done.
			 */
			setToggleChangesDisabled: (isDisabled: boolean) => EditorCommand;
			/**
			 * Toggles the displaying of changes in the editor.
			 */
			toggleChanges: EditorCommand;
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
		pluginConfiguration?: TrackChangesPluginOptions | undefined;
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
			/**
			 * Whether toggling track changes has been disabled by another plugin that currently
			 * owns the diff decorations (see the `setToggleChangesDisabled` command).
			 * Defaults to false.
			 */
			isToggleChangesDisabled: boolean;
		};
	}
>;

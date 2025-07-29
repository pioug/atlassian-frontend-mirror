import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { ShowDiffPlugin } from '@atlaskit/editor-plugin-show-diff';

export type TrackChangesPlugin = NextEditorPlugin<
	'trackChanges',
	{
		commands: {
			/**
			 * Toggles the displaying of changes in the editor.
			 */
			toggleChanges: EditorCommand;
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
		dependencies: [ShowDiffPlugin];
	}
>;

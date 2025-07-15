import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

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
		};
	}
>;

import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { UserIntent } from './pm-plugins/types';

export type UserIntentPlugin = NextEditorPlugin<
	'userIntent',
	{
		commands: {
			/**
			 * @param newCurrentUserIntent the new current user intent to set - once set it will need to be updated once that intention has changed
			 * @returns
			 */
			setCurrentUserIntent: (newCurrentUserIntent: UserIntent) => EditorCommand;
		};
		sharedState:
			| {
					currentUserIntent: UserIntent;
			  }
			| undefined;
	}
>;

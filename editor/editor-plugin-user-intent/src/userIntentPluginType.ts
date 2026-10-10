import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

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

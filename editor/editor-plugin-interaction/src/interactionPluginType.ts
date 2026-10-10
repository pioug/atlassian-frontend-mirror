import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types/next-editor-plugin';

type InteractionCommands = {
	handleInteraction: EditorCommand;
};

export type SharedInteractionState = {
	interactionState: null | 'hasNotHadInteraction';
};

export type InteractionPlugin = NextEditorPlugin<
	'interaction',
	{
		commands: InteractionCommands;
		sharedState: SharedInteractionState;
	}
>;

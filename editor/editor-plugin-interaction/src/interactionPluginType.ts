import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

type InteractionCommands = {
	handleInteraction: EditorCommand;
};

export type SharedInteractionState = {
	interactionState: null | 'hasNotHadInteraction';
};

export type InteractionPlugin = NextEditorPlugin<
	'interaction',
	{
		sharedState: SharedInteractionState;
		commands: InteractionCommands;
	}
>;

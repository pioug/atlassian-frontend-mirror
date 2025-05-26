import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

type InteractionCommands = {
	handleInteraction: EditorCommand;
};

export type SharedInteractionState = {
	// Clean up with platform_editor_interaction_api_refactor
	hasHadInteraction: boolean;
	interactionState: null | 'hasNotHadInteraction';
};

export type InteractionPlugin = NextEditorPlugin<
	'interaction',
	{
		sharedState: SharedInteractionState;
		commands: InteractionCommands;
	}
>;

import type { EditorCommand, NextEditorPlugin } from '@atlaskit/editor-common/types';

import { type InteractionState } from './types';

type InteractionCommands = {
	handleInteraction: EditorCommand;
};

export type InteractionPlugin = NextEditorPlugin<
	'interaction',
	{ sharedState: InteractionState; commands: InteractionCommands }
>;

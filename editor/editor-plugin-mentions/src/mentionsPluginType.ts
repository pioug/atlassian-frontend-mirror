import type {
	NextEditorPlugin,
	OptionalPlugin,
	EditorCommand,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { MentionProvider } from '@atlaskit/mention/resource';

import type { InsertMentionParameters } from './editor-commands';
import type { MentionPluginOptions, MentionSharedState } from './types';

export type MentionActionOpenTypeAhead = (inputMethod: TypeAheadInputMethod) => boolean;

export type MentionActionAnnounceMentionsInsertion = (
	mentionIds: {
		id: string;
		localId: string;
		taskLocalId?: string;
		type: 'added' | 'deleted';
	}[],
) => void;

export type MentionActionSetProvider = (provider: Promise<MentionProvider>) => Promise<boolean>;

export type MentionActions = {
	announceMentionsInsertion: MentionActionAnnounceMentionsInsertion;
	openTypeAhead: MentionActionOpenTypeAhead;
	setProvider: MentionActionSetProvider;
};

export type MentionPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	TypeAheadPlugin,
	OptionalPlugin<ContextIdentifierPlugin>,
	OptionalPlugin<BasePlugin>,
	OptionalPlugin<SelectionPlugin>,
];

export type MentionsPlugin = NextEditorPlugin<
	'mention',
	{
		actions: MentionActions;
		commands: {
			/**
			 * Inserts mention node into the document based on parameters.
			 *
			 * !Warning at this stage only inserts single mentions
			 *
			 * @param params.name string
			 * @param params.id string
			 * @param params.userType string (optional)
			 * @param params.nickname string (optional)
			 * @param params.localId string (optional)
			 * @param params.accessLevel string (optional)
			 * @param params.isXProductUser boolean (optional)
			 * @returns
			 */
			insertMention: (params: InsertMentionParameters) => EditorCommand;
		};
		dependencies: MentionPluginDependencies;
		pluginConfiguration: MentionPluginOptions | undefined;
		sharedState: MentionSharedState | undefined;
	}
>;

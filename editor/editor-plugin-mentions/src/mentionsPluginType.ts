import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BasePlugin } from '@atlaskit/editor-plugin-base';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { MentionProvider } from '@atlaskit/mention/resource';

import type { MentionPluginOptions, MentionSharedState } from './types';

export type MentionActionOpenTypeAhead = (inputMethod: TypeAheadInputMethod) => boolean;

export type MentionActionAnnounceMentionsInsertion = (
	mentionIds: {
		type: 'added' | 'deleted';
		localId: string;
		id: string;
		taskLocalId?: string;
	}[],
) => void;

export type MentionActionSetProvider = (provider: Promise<MentionProvider>) => Promise<boolean>;

export type MentionActions = {
	openTypeAhead: MentionActionOpenTypeAhead;
	announceMentionsInsertion: MentionActionAnnounceMentionsInsertion;
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
		pluginConfiguration: MentionPluginOptions | undefined;
		dependencies: MentionPluginDependencies;
		sharedState: MentionSharedState | undefined;
		actions: MentionActions;
	}
>;

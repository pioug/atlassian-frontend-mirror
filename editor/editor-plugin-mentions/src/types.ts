import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import { type ProfilecardProvider } from '@atlaskit/editor-common/src/provider-factory/profile-card-provider';
import type {
	NextEditorPlugin,
	OptionalPlugin,
	TypeAheadHandler,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { TypeAheadInputMethod, TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { MentionDescription, MentionProvider } from '@atlaskit/mention';

export const MENTION_PROVIDER_REJECTED = 'REJECTED';
export const MENTION_PROVIDER_UNDEFINED = 'UNDEFINED';

export interface TeamInfoAttrAnalytics {
	teamId: string;
	includesYou: boolean;
	memberCount: number;
}

export interface MentionPluginConfig {
	HighlightComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
	// flag to indicate display name instead of nick name should be inserted for mentions
	// default: false, which inserts the nick name
	insertDisplayName?: boolean;
	profilecardProvider?: Promise<ProfilecardProvider>;
}

export interface MentionPluginOptions extends MentionPluginConfig {
	sanitizePrivateContent?: boolean;
	allowZeroWidthSpaceAfter?: boolean;
	handleMentionsChanged?: (
		mentionChanges: {
			type: 'added' | 'deleted';
			localId: string;
			id: string;
			taskLocalId?: string;
		}[],
	) => void;
}

export type MentionPluginState = {
	mentionProvider?: MentionProvider;
	mentions?: Array<MentionDescription>;
	canInsertMention?: boolean;
};

export type FireElementsChannelEvent = (payload: AnalyticsEventPayload, channel?: string) => void;

export type MentionSharedState = MentionPluginState & {
	typeAheadHandler: TypeAheadHandler;
};
export type MentionsPlugin = NextEditorPlugin<
	'mention',
	{
		pluginConfiguration: MentionPluginOptions | undefined;
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			TypeAheadPlugin,
			OptionalPlugin<ContextIdentifierPlugin>,
		];
		sharedState: MentionSharedState | undefined;
		actions: {
			openTypeAhead: (inputMethod: TypeAheadInputMethod) => boolean;
			announceMentionsInsertion: (
				mentionIds: {
					type: 'added' | 'deleted';
					localId: string;
					id: string;
					taskLocalId?: string;
				}[],
			) => void;
		};
	}
>;

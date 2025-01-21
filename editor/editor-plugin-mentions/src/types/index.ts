import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { Providers, ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types';
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
	mentionProvider?: Providers['mentionProvider'];
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

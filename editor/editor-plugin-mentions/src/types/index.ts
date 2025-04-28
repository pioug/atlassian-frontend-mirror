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

export type MentionsChangedHandler = (
	changes: {
		type: 'added' | 'deleted';
		localId: string;
		id: string;
		taskLocalId?: string;
	}[],
) => void;

export interface MentionsPluginOptions extends MentionPluginConfig {
	mentionProvider?: Providers['mentionProvider'];
	sanitizePrivateContent?: boolean;
	allowZeroWidthSpaceAfter?: boolean;
	handleMentionsChanged?: MentionsChangedHandler;
}

/**
 * @private
 * @deprecated Use {@link MentionsPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type MentionPluginOptions = MentionsPluginOptions;

export type MentionPluginState = {
	mentionProvider?: MentionProvider;
	mentions?: Array<MentionDescription>;
	canInsertMention?: boolean;
};

export type FireElementsChannelEvent = (payload: AnalyticsEventPayload, channel?: string) => void;

export type MentionSharedState = MentionPluginState & {
	typeAheadHandler: TypeAheadHandler;
};

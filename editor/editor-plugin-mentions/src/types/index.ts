import type { AnalyticsEventPayload } from '@atlaskit/editor-common/analytics';
import type { Providers, ProfilecardProvider } from '@atlaskit/editor-common/provider-factory';
import type { TypeAheadHandler } from '@atlaskit/editor-common/types';
import type { MentionDescription, MentionProvider } from '@atlaskit/mention';

export const MENTION_PROVIDER_REJECTED = 'REJECTED';
export const MENTION_PROVIDER_UNDEFINED = 'UNDEFINED';

export interface TeamInfoAttrAnalytics {
	includesYou: boolean;
	memberCount: number;
	teamId: string;
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
		id: string;
		localId: string;
		taskLocalId?: string;
		type: 'added' | 'deleted';
	}[],
) => void;

export interface MentionsPluginOptions extends MentionPluginConfig {
	allowZeroWidthSpaceAfter?: boolean;
	handleMentionsChanged?: MentionsChangedHandler;
	mentionProvider?: Providers['mentionProvider'];
	sanitizePrivateContent?: boolean;
}

/**
 * @private
 * @deprecated Use {@link MentionsPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type MentionPluginOptions = MentionsPluginOptions;

export type MentionPluginState = {
	canInsertMention?: boolean;
	mentionProvider?: MentionProvider;
	mentions?: Array<MentionDescription>;
};

export type FireElementsChannelEvent = (payload: AnalyticsEventPayload, channel?: string) => void;

export type MentionSharedState = MentionPluginState & {
	typeAheadHandler: TypeAheadHandler;
};

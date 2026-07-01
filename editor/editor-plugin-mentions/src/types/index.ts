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

export type MentionChange = {
	id: string;
	localId: string;
	method?: 'pasted' | 'typed';
	shouldSuppressMentionNotification?: boolean;
	taskLocalId?: string;
	type: 'added' | 'deleted';
};

export type MentionsChangedHandler = (changes: MentionChange[]) => void;

export interface MentionsPluginOptions extends MentionPluginConfig {
	allowZeroWidthSpaceAfter?: boolean;
	/**
	 * User ID to highlight as a self-mention (typically the current user).
	 *
	 * When provided, mentions matching this ID will be highlighted immediately,
	 * without waiting for the mention provider to load. This enables instant highlighting on initial render.
	 * Takes priority over `MentionProvider.shouldHighlightMention()` if both are present.
	 */
	currentUserId?: string;
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

export type AgentMentionDetails = {
	context: string | null;
	id: string;
	localId: string;
	name: string | null;
	nodeSize: number;
	/**
	 * @internal ProseMirror position used for parent-boundary checks.
	 */
	parentEnd: number;
	parentNodeType: string | null;
	/**
	 * @internal ProseMirror position used for parent-boundary checks.
	 */
	parentStart: number;
	pos: number;
};

export type MentionPluginState = {
	canInsertMention?: boolean;
	/**
	 * Increments on each new agent mention insertion (including re-mentions of the same agent).
	 * Used to trigger re-renders when the same agent is mentioned again.
	 */
	lastAgentMentionInsertionCount?: number;
	/**
	 * Plain-text content of the block node containing the agent mention.
	 * Used as a prompt context for Rovo chat.
	 */
	lastInsertedAgentMentionContext?: string | null;
	/**
	 * The ID of the most recently inserted agent (APP | AGENT userType) mention.
	 * Null when no agent mention is present in the document.
	 */
	lastInsertedAgentMentionId?: string | null;
	/**
	 * The local document-instance ID of the most recently inserted agent mention.
	 * Used to distinguish multiple mentions of the same agent AAID.
	 */
	lastInsertedAgentMentionLocalId?: string | null;
	/**
	 * Display name of the most recently inserted agent mention.
	 * Derived from the mention node text and used for Rovo nudge copy.
	 */
	lastInsertedAgentMentionName?: string | null;
	/**
	 * ProseMirror node type of the direct parent of the agent mention
	 * (e.g. 'taskItem', 'paragraph'). Determines auto-send vs. draft behaviour.
	 */
	lastInsertedAgentMentionParentNodeType?: string | null;
	mentionProvider?: MentionProvider;
	mentions?: Array<MentionDescription>;
	/**
	 * @internal Tracks a typed agent mention while waiting for the platform-side
	 * ready-to-fire trigger. Consumers should continue to react only to
	 * lastInsertedAgentMention* fields.
	 */
	pendingTypedAgentMention?: {
		id: string;
		localId: string;
		name: string | null;
		nodeSize: number;
		pos: number;
		/**
		 * Generation value for the inactivity timer. This changes when local edits
		 * reset the pending mention window, so stale timer callbacks for the same
		 * localId cannot publish before the latest inactivity period has elapsed.
		 */
		resetCount: number;
	} | null;
};

export type FireElementsChannelEvent = (payload: AnalyticsEventPayload, channel?: string) => void;

export type MentionSharedState = MentionPluginState & {
	typeAheadHandler: TypeAheadHandler;
};

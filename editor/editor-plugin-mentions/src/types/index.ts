import type { DocNode } from '@atlaskit/adf-schema';
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
	/**
	 * Enables People / Agents sectioning in the mentions typeahead.
	 *
	 * Consumers own the rollout decision for their editor surface; the shared
	 * mentions plugin only applies the resulting presentation option.
	 */
	enableAgentSectioning?: boolean;
	/**
	 * Optional getter injected by Rovo-aware consumers to check whether the Rovo
	 * panel is currently open. When provided, the mentions plugin uses it to
	 * suppress the agent-mention nudge when Rovo is already visible.
	 */
	getIsRovoPanelOpen?: () => boolean;
	handleMentionsChanged?: MentionsChangedHandler;
	mentionProvider?: Providers['mentionProvider'];
	/**
	 * Optional callback injected by Rovo-aware consumers (e.g. Confluence) to
	 * handle the "Chat with Agent" action on the agent profile card. When provided,
	 * clicking "Chat" on the card calls this function instead of the card's default
	 * handler, so the caller can pass editor context to Rovo chat. The `agentId` argument is the UUID.
	 *
	 * Gated behind `platform_editor_agent_mentions`.
	 */
	onAgentMentionChatClick?: (agentId: string, agentMentionContext?: DocNode) => void;
	sanitizePrivateContent?: boolean;
	/**
	 * Shows the experimental Labs label beside the agent mentions section when the agent mentions experiment is enabled.
	 */
	showAgentMentionsLabsLozenge?: boolean;
}

/**
 * @private
 * @deprecated Use {@link MentionsPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type MentionPluginOptions = MentionsPluginOptions;

export type AgentMentionDetails = {
	context: DocNode;
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
	prompt: string | null;
};

export type MentionPluginState = {
	canInsertMention?: boolean;
	/**
	 * Increments on each new agent mention insertion (including re-mentions of the same agent).
	 * Used to trigger re-renders when the same agent is mentioned again.
	 */
	lastAgentMentionInsertionCount?: number;
	/**
	 * Prompt-safe ADF context from the direct parent of the agent mention.
	 * Used as a prompt context for Rovo chat.
	 */
	lastInsertedAgentMentionContext?: DocNode | null;
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
	/**
	 * Plain-text prompt from the direct parent of the agent mention.
	 * Preserves the pre-ADF fallback behaviour for chat input drafts.
	 */
	lastInsertedAgentMentionPrompt?: string | null;
	mentionProvider?: MentionProvider;
	mentions?: Array<MentionDescription>;
	/**
	 * @internal Tracks a pasted agent mention pending name resolution (cache miss).
	 * view().update() calls resolveMentionName() silently until resolved, then
	 * RESOLVE_PASTED_AGENT_MENTION_NAME promotes it to lastInsertedAgentMention*
	 * and fires a public dispatch. Consumers should react only to lastInsertedAgentMention*.
	 */
	pendingPastedAgentMention?: {
		context: DocNode;
		id: string;
		localId: string;
		parentNodeType: string | null;
		prompt: string | null;
	} | null;
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
		/**
		 * ProseMirror node type of the direct parent of the pending agent mention
		 * (e.g. 'taskItem', 'paragraph'). Used in the inactivity timer to skip the
		 * getIsRovoPanelOpen() suppression check for task-item mentions.
		 */
		parentNodeType: string | null;
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

export type MentionSharedState = Omit<MentionPluginState, 'pendingPastedAgentMention'> & {
	typeAheadHandler: TypeAheadHandler;
};

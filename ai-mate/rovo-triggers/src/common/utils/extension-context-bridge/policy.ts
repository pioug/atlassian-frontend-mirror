import { type Payload } from '../../../types';

/**
 * Bridge relay policy, asymmetric by direction:
 * - Product → extension (context): relayed iff allowlisted and not denylisted. The denylist is a
 *   backstop for control-plane/auth events that must never cross.
 * - Extension → product (actions): allowlist only, so the chat's internal state never drives the
 *   product.
 *
 * Independent of both lists: the loop guard (`BRIDGE_SOURCE`) and auto-drop of non-serialisable
 * payloads.
 */

/** Inbound allowlist — payload types the bridge supports. Widen only as a feature needs it. */
const INBOUND_ALLOWLIST = new Set<Payload['type']>([
	'editor-context-payload',
	'set-message-context',
] satisfies Payload['type'][]);

/**
 * Inbound `set-message-context` allowlist, keyed on `contextKey`.
 *
 * The type-level allowlist is not enough for this one payload. Its `data.value` is arbitrary
 * product-supplied context, so — unlike `editor-context-payload`, whose content a co-resident script
 * could equally read from the DOM — it can carry data the extension has no other route to. An
 * allowlist rather than a denylist because a denylist cannot cover keys publishers add later, which
 * is the drift this guards against (SECASR-8597).
 */
const INBOUND_CONTEXT_KEYS = new Set<string>([
	// The key every Jira view-context publisher uses. Not reachable yet — only Confluence opts into
	// the bridge, and its own publishers are merge-style, which `./registry` drops. Seeded so the
	// Jira read-context work does not have to rediscover this list.
	'jira_view_context',
]);

/** True if a `set-message-context` payload carrying this `contextKey` may cross to the extension. */
export const isRelayableContextKey = (contextKey: string): boolean =>
	INBOUND_CONTEXT_KEYS.has(contextKey);

/** Inbound denylist — control-plane/auth events that must never reach the extension chat. */
const INBOUND_DENYLIST = new Set<Payload['type']>([
	'message-send',
	'chat-new',
	'chat-open',
	'chat-close',
	'open-smart-creation-modal',
	'open-browse-agent-modal',
	'open-browse-agent-sidebar',
	'open-chat-debug-modal',
	'open-chat-feedback-modal',
	'forge-auth-success',
	'forge-auth-failure',
	'chat-smartlink-3p-post-auth-launch',
] satisfies Payload['type'][]);

/** Outbound allowlist — chat-originated events allowed to cross back to the product. */
const OUTBOUND_ACTIONS = new Set<Payload['type']>([
	'editor-suggestion',
] satisfies Payload['type'][]);

/** Why a product-bus payload was or was not relayed. */
type InboundDecision = 'allow' | 'not-allowlisted' | 'denylisted';

/** Classify a product-bus payload. Relay iff `allow`. */
export const getInboundDecision = (type: Payload['type']): InboundDecision => {
	if (INBOUND_DENYLIST.has(type)) {
		return 'denylisted';
	}
	return INBOUND_ALLOWLIST.has(type) ? 'allow' : 'not-allowlisted';
};

/** True if a chat-bus payload of this type may be relayed back to the product. */
export const shouldRelayToProduct = (type: Payload['type']): boolean => OUTBOUND_ACTIONS.has(type);

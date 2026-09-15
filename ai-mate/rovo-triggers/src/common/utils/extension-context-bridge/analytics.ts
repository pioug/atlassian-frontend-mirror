/**
 * Inbound relay decision reporting: what the product asked the bridge to relay, and what the policy
 * in `./policy` / `./registry` decided. Every refusal is otherwise silent, so the allowlist can only
 * be widened from data with this.
 *
 * Product → extension only, hence no direction field. The outbound allowlist has one entry and is
 * owned by the chat, so products cannot drift into it.
 *
 * Consumer-supplied callback rather than an event fired here, for the same reason as the Host's
 * `getContentId`: this package has no analytics dependency.
 */

import { type Payload } from '../../../types';

import { type InboundDecision } from './policy';

/**
 * Why `./registry` refused to serialise a payload. Kept distinct because the fixes differ:
 * `context-key-not-allowlisted` is a list we can widen, the rest are publisher-side shape problems.
 */
export type SerializationDropReason =
	| 'missing-set-context'
	| 'context-key-not-allowlisted'
	| 'set-context-threw'
	| 'merge-style-publisher'
	| 'not-serializable';

/** Every outcome the bridge can reach for a payload it was asked to relay. */
export type RelayDecision = InboundDecision | SerializationDropReason;

/** A slot identifier by contract, capped in case a publisher ever interpolates an id into one. */
const MAX_CONTEXT_KEY_LENGTH = 80;

/**
 * (payload types × decisions) is finite and far below this; the cap is for `contextKey`, which is
 * not. A publisher generating keys would otherwise grow the dedupe set for the life of the page.
 */
const MAX_REPORTED_DECISIONS = 50;

export type BridgeRelayDecision = {
	/** The bus payload type, e.g. `editor-context-payload`. */
	payloadType: Payload['type'];
	/** Context slot for `set-message-context`; undefined for every other type. */
	contextKey?: string;
	/**
	 * Whether the policy admitted it. Reported before the `postMessage`, so a throwing transport
	 * reads as a broken channel elsewhere rather than a policy refusal here.
	 */
	relayed: boolean;
	/** Why, in the policy's own vocabulary. */
	decision: RelayDecision;
	/** The surface that published it, i.e. the payload's own `source`. */
	publisherSource?: string;
	/** The product the publisher stamped on the payload. */
	payloadProduct?: string;
};

export type OnBridgeRelayDecision = (decision: BridgeRelayDecision) => void;

/**
 * The context slot a `set-message-context` payload addresses. Shape-checked rather than cast: runs
 * against the raw bus payload, the serialized form, and types carrying neither. The Host also keys
 * its replay map on this.
 */
export const getContextKey = (payload: { type: string; data?: unknown }): string | undefined => {
	if (payload.type !== 'set-message-context') {
		return undefined;
	}
	const data = payload.data;
	const contextKey =
		typeof data === 'object' && data !== null && 'contextKey' in data
			? (data as { contextKey?: unknown }).contextKey
			: undefined;
	return typeof contextKey === 'string' ? contextKey : undefined;
};

/** Identity of a decision for deduplication purposes. */
const getDecisionKey = ({ payloadType, contextKey, decision }: BridgeRelayDecision): string =>
	`${payloadType}|${contextKey ?? ''}|${decision}`;

/**
 * Report a relay decision at most once per distinct outcome. Deduplicated because the bridge sees
 * the whole product bus and `editor-context-payload` recurs on roughly every keystroke; which keys
 * exist and how they were decided is the question, not how often each recurred.
 *
 * `seen` is caller-owned (a ref in the Host), so the window is one mount. Never throws.
 */
export const reportRelayDecision = (
	seen: Set<string>,
	onRelayDecision: OnBridgeRelayDecision | undefined,
	decision: BridgeRelayDecision,
): void => {
	if (!onRelayDecision) {
		return;
	}
	const truncatedContextKey = decision.contextKey?.slice(0, MAX_CONTEXT_KEY_LENGTH);
	const reportable: BridgeRelayDecision = { ...decision, contextKey: truncatedContextKey };
	const key = getDecisionKey(reportable);
	if (seen.has(key) || seen.size >= MAX_REPORTED_DECISIONS) {
		return;
	}
	seen.add(key);
	try {
		onRelayDecision(reportable);
	} catch {
		// Reporting is observability, never a reason for the relay to fail.
	}
};

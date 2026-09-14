import { useEffect, useMemo, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { useSubscribeAll } from '../../../main';

import {
	BRIDGE_CONTROL_REQUEST_CONTEXT,
	BRIDGE_MESSAGE_MARKER,
	BRIDGE_SOURCE,
	BRIDGE_TO_EXTENSION,
	BRIDGE_TO_PRODUCT,
} from './constants';
import { getInboundDecision } from './policy';
import { serializePayload } from './registry';
import {
	createWindowTransport,
	isBridgeControlMessage,
	type BridgeMessage,
	type Transport,
} from './transport';
import type { SerializedPayload } from './transport';

/**
 * Stamps the page id onto `editor-context-payload` when the product left it unpopulated, since the
 * extension chat cannot derive its own `contentId` from `window.location` (that's the side panel, not
 * the page). `getContentId` is supplied by the consumer rather than read here, to avoid this package
 * taking a dependency on `conversation-assistant-store` (a cyclic-dependency risk); the consumer
 * already depends on that store and can resolve the id from it directly.
 */
const stampProductContentId = (
	serialized: SerializedPayload,
	targetContentId: string | undefined,
): void => {
	if (serialized.type !== 'editor-context-payload') {
		return;
	}
	const data = serialized.data as { contentMauiId?: string | null } | undefined;
	if (!data || data.contentMauiId) {
		return;
	}
	if (targetContentId) {
		data.contentMauiId = targetContentId;
	}
};

/**
 * Identity of a context *slot*. `set-message-context` is keyed by `contextKey` because a product
 * publishes several independent contexts, each superseding only its own previous value; everything
 * else is keyed by payload type, of which there is one live instance at a time.
 */
const getContextSlotKey = (payload: { type: string; data?: unknown }): string => {
	if (payload.type === 'set-message-context') {
		const data = payload.data;
		const contextKey =
			typeof data === 'object' && data !== null && 'contextKey' in data
				? (data as { contextKey?: unknown }).contextKey
				: undefined;
		if (typeof contextKey === 'string') {
			return `${payload.type}:${contextKey}`;
		}
	}
	return payload.type;
};

type Props = {
	/** Override the transport (tests). Defaults to same-window `postMessage`. */
	transport?: Transport;
	/** Resolves the current content id at relay time (a getter, so the Host reads it lazily). */
	getContentId?: () => string | undefined;
	/**
	 * Whether the viewer is entitled to Rovo. `false` relays nothing, so a tenant with AI turned off
	 * never has page content cross into the extension (SECASR-8597).
	 *
	 * Supplied by the consumer for the same reason as `getContentId`: the signal lives in
	 * `conversation-assistant-entitlement` and this package stays clear of that dependency.
	 * `undefined` means the consumer expressed no opinion, and relaying proceeds — every in-tree
	 * mount passes it explicitly, so that only covers bespoke embeddings.
	 */
	isAiEnabled?: boolean;
};

/**
 * Product-window half of the bridge. Observes the `ai-mate` bus and mirrors allowlisted context out
 * to the extension via same-window `postMessage` (see `./policy` for the allow/deny rules).
 *
 * The reverse direction is handled by the sibling `RovoPostMessagePubsubListener` in
 * `ChatOpenerSubscriber`, not here. Headless; mounts at product root via `ChatOpenerSubscriber`.
 */
export const ExtensionContextBridgeHost = ({
	transport,
	getContentId,
	isAiEnabled,
}: Props): null => {
	// Self-gated (not taken from the consumer) so this cannot mount by mistake wherever
	// `ChatOpenerSubscriber` renders. Matches `BRIDGE_FEATURE_GATE` in `./constants`.
	const active = fg('rovo-ext_context_bridge');

	const activeTransport = useMemo<Transport | undefined>(() => {
		if (!active) {
			return undefined;
		}
		if (transport) {
			return transport;
		}
		if (typeof window === 'undefined') {
			return undefined;
		}
		return createWindowTransport({ targetWindow: window });
	}, [active, transport]);

	/**
	 * The last message relayed for each context slot, kept so a chat opened later can be caught up.
	 *
	 * Deliberately held here rather than in the extension. This is the page's own context, already in
	 * this page's memory, scoped to this document and gone when it unloads — so answering a request
	 * creates no copy that outlives the page, and a chat that is never opened is never sent anything.
	 */
	const lastRelayedRef = useRef<Map<string, BridgeMessage>>(new Map());

	// Answers `request-context` from the chat, which cannot observe context published before it
	// mounted. Products such as Jira publish once per navigation, so without this a chat opened after
	// the page settled would describe the wrong view — or none at all.
	useEffect(() => {
		if (!activeTransport) {
			return;
		}
		return activeTransport.subscribe((message) => {
			if (!isBridgeControlMessage(message) || message.direction !== BRIDGE_TO_PRODUCT) {
				return;
			}
			if (message.control !== BRIDGE_CONTROL_REQUEST_CONTEXT) {
				return;
			}
			// Re-checked here, not just at relay time: entitlement can change while the page is open.
			if (isAiEnabled === false) {
				return;
			}
			lastRelayedRef.current.forEach((relayed) => {
				try {
					activeTransport.send(relayed);
				} catch {
					// Never let bridging break the host page.
				}
			});
		});
	}, [activeTransport, isAiEnabled]);

	useSubscribeAll((payload) => {
		if (!activeTransport) {
			return;
		}
		// Checked at relay time rather than when the transport is built: the product renders its
		// `RovoEntitlementSetter` as a sibling of `ChatOpenerSubscriber`, so the store is still
		// unpopulated on this component's first render. By the time a payload arrives it has settled.
		if (isAiEnabled === false) {
			return;
		}
		// Loop guard.
		if (payload.interactionSource === BRIDGE_SOURCE) {
			return;
		}
		if (getInboundDecision(payload.type) !== 'allow') {
			return;
		}
		const serialized = serializePayload(payload);
		if (!serialized) {
			return;
		}
		stampProductContentId(serialized, getContentId?.());
		const message: BridgeMessage = {
			[BRIDGE_MESSAGE_MARKER]: true,
			direction: BRIDGE_TO_EXTENSION,
			payload: serialized,
		};
		// Keyed by context slot, not by message, so a re-publish replaces rather than accumulates.
		// A cleared context is recorded too: replaying it clears the chat rather than resurrecting
		// context the page no longer shows.
		//
		// Publisher contract: in an SPA this component outlives any single route, so a slot stays
		// filled until its publisher says otherwise. Publishers must clear on unmount (publish with
		// `setContext` returning undefined) or a later route could be answered with a previous
		// view's context. Every Jira view-context publisher does this today.
		lastRelayedRef.current.set(getContextSlotKey(serialized), message);
		try {
			activeTransport.send(message);
		} catch {
			// Never let bridging break the host page.
		}
	});

	return null;
};

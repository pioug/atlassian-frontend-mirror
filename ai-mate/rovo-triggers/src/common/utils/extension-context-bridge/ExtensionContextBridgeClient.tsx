import { useEffect, useMemo, useRef } from 'react';

import { UNSAFE_expValNoExposure } from '@atlaskit/platform-feature-experiments/unsafe-exp-val-no-exposure';

import { usePublish, useSubscribeAll } from '../../../main';
import {
	BRIDGE_CONTROL_REQUEST_CONTEXT,
	BRIDGE_MESSAGE_MARKER,
	BRIDGE_SOURCE,
	BRIDGE_TO_EXTENSION,
	BRIDGE_TO_PRODUCT,
} from './constants';
import { shouldRelayToProduct } from './policy';
import { deserializePayload, serializePayload } from './registry';
import { createWindowTransport, isBridgeControlMessage, type Transport } from './transport';

type Props = {
	/** Override the transport (tests). Defaults to iframe<->parent `postMessage`. */
	transport?: Transport;
	/**
	 * Full origins the chat will talk to, e.g. `chrome-extension://<id>` — not bare ids. Supplied by
	 * the consumer, which knows its own published ids, so a new extension channel needs no platform
	 * release. Must be a stable reference; the transport is memoised on it.
	 *
	 * Omitted, the Client is inert. `frame-ancestors` on this app already limits who can frame it, but
	 * any extension holding `declarativeNetRequest` can strip that header, so this list is what
	 * actually pins the channel to our own extension rather than any installed one.
	 */
	allowedOrigins?: readonly string[];
};

/** Selection shape preserved across editor focus loss. */
type PreservedSelection = { type: string; content: string };

/**
 * The side panel's own origin, supplied by `buildIframeUrl()` in the extension's `sidepanel.ts`.
 * Serves as both the `postMessage` target and the only origin this client accepts messages from.
 *
 * The parameter only selects which of `allowedOrigins` is the peer; it can never introduce one. So
 * an absent parameter, an unknown extension, and an absent list all resolve to `undefined`, leaving
 * the Client without a transport. `useSBSEvaluationBridge` reads the same parameter but falls back to
 * `'*'` — tolerable for telemetry, not for a channel that drives editor writes.
 */
const getSidePanelOrigin = (allowedOrigins?: readonly string[]): string | undefined => {
	try {
		const value = new URLSearchParams(window.location.search).get('extensionOrigin');
		return value && allowedOrigins?.includes(value) ? value : undefined;
	} catch {
		return undefined;
	}
};

/**
 * Whether focus currently sits inside the chat. Confluence clears `selection` on
 * `editor-context-payload` both when the user clicks into chat and when they genuinely deselect;
 * this distinguishes the two so the former can preserve the selection and the latter can drop it.
 */
const isChatFocused = (): boolean => {
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- reading focus of the chat iframe's own document is the point
	return typeof document !== 'undefined' && document.hasFocus();
};

/**
 * Chat-iframe half of the bridge.
 * - Inbound: deserializes context from the extension transport and re-publishes it onto the
 *   iframe's own `ai-mate` bus for the existing `ChatContextSubscriber` to consume unchanged.
 * - Outbound: forwards allowlisted action payloads (e.g. `editor-suggestion`) back to the product,
 *   via the extension's content script.
 *
 * Content writes (`rovo-content-bridge-api` commands) are not handled here — that API already
 * crosses this boundary on its own, so the extension only relays envelopes for it.
 *
 * Headless.
 */
export const ExtensionContextBridgeClient = ({ transport, allowedOrigins }: Props): null => {
	// Self-gated. Matches `EXT_CONTEXT_BRIDGE_EXPERIMENT` in `./constants`. No-exposure read: the
	// extension decides whether to mount this and owns the exposure call.
	const active =
		UNSAFE_expValNoExposure('rovo-ext_context_bridge_exp', 'isEnabled', false) === true;
	const publish = usePublish('ai-mate');
	const lastKnownSelectionRef = useRef<PreservedSelection | null>(null);

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
		const sidePanelOrigin = getSidePanelOrigin(allowedOrigins);
		if (!sidePanelOrigin) {
			return undefined;
		}
		// The side panel is a different origin to this iframe, so `targetOrigin` cannot fall back to
		// `selfWindow.location.origin`. `acceptOrigin` follows it: the panel is the only peer.
		return createWindowTransport({
			targetWindow: window.parent,
			self: window,
			targetOrigin: sidePanelOrigin,
		});
	}, [active, transport, allowedOrigins]);

	// Inbound (READ): product context -> iframe bus.
	useEffect(() => {
		if (!activeTransport) {
			return;
		}
		return activeTransport.subscribe((message) => {
			// Control messages are requests to the product, never context for the chat.
			if (isBridgeControlMessage(message)) {
				return;
			}
			if (message.direction !== BRIDGE_TO_EXTENSION) {
				return;
			}
			let payloadToPublish = deserializePayload(message.payload);
			if (!payloadToPublish) {
				return;
			}
			const editorData = message.payload.data as
				| {
						// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- payload field, not the global `document`
						document?: unknown;
						isViewMode?: boolean;
						selection?: PreservedSelection;
				  }
				| undefined;

			if (message.payload.type === 'editor-context-payload') {
				if (!editorData?.document || editorData?.isViewMode) {
					// Editor closed or switched to view mode.
					lastKnownSelectionRef.current = null;
				} else if (editorData.selection?.content) {
					// New selection.
					lastKnownSelectionRef.current = editorData.selection;
				} else if (lastKnownSelectionRef.current && isChatFocused()) {
					// Focus moved into the chat; re-inject the selection so Insert/Replace still resolves.
					payloadToPublish = deserializePayload({
						...message.payload,
						data: { ...editorData, selection: lastKnownSelectionRef.current },
					});
				} else {
					// Real deselection; drop it so context falls back to the page.
					lastKnownSelectionRef.current = null;
				}
			}

			if (payloadToPublish) {
				publish(payloadToPublish);
			}
		});
	}, [activeTransport, publish]);

	// Handshake: ask the product to re-send its current context.
	//
	// The chat only ever sees context published while it is listening, and it mounts long after the
	// page — the user opens the side panel on a page that settled minutes ago. Products that publish
	// once per navigation (Jira views) would otherwise never be observed at all. Asking, rather than
	// having the extension retain context on the chance a panel opens later, keeps page data in the
	// page until a chat actually exists to receive it.
	useEffect(() => {
		if (!activeTransport) {
			return;
		}
		try {
			activeTransport.send({
				[BRIDGE_MESSAGE_MARKER]: true,
				direction: BRIDGE_TO_PRODUCT,
				control: BRIDGE_CONTROL_REQUEST_CONTEXT,
			});
		} catch {
			// Never let bridging break the chat iframe.
		}
	}, [activeTransport]);

	// Outbound (WRITE, payloads): allowlisted chat actions -> product.
	useSubscribeAll((payload) => {
		if (!activeTransport) {
			return;
		}
		// Loop guard.
		if (payload.interactionSource === BRIDGE_SOURCE) {
			return;
		}
		if (!shouldRelayToProduct(payload.type)) {
			return;
		}
		const result = serializePayload(payload);
		if (!result.ok) {
			return;
		}
		try {
			activeTransport.send({
				[BRIDGE_MESSAGE_MARKER]: true,
				direction: BRIDGE_TO_PRODUCT,
				payload: result.payload,
			});
		} catch {
			// Never let bridging break the chat iframe.
		}
	});

	return null;
};

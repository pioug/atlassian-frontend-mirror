import { bind } from 'bind-event-listener';

import { type Payload } from '../../../types';
import { BRIDGE_CONTROL_REQUEST_CONTEXT, BRIDGE_MESSAGE_MARKER } from './constants';
import type { BRIDGE_TO_EXTENSION, BRIDGE_TO_PRODUCT } from './constants';

type BridgeDirection = typeof BRIDGE_TO_EXTENSION | typeof BRIDGE_TO_PRODUCT;

/**
 * A `rovo-triggers` payload reduced to a structured-clone-safe shape. Functions (e.g.
 * `set-message-context`'s `setContext`) are resolved to values by `./registry` first.
 */
export type SerializedPayload = {
	type: Payload['type'];
	source?: string;
	product?: Payload['product'];
	openChat?: boolean;
	data: unknown;
};

export type BridgeMessage = {
	[BRIDGE_MESSAGE_MARKER]: true;
	direction: BridgeDirection;
	payload: SerializedPayload;
};

/**
 * Control-plane message. Distinguished from `BridgeMessage` by carrying `control` instead of
 * `payload`, so a control message can never be mistaken for relayed context: the guards are
 * mutually exclusive on the presence of those fields.
 */
export type BridgeControlMessage = {
	[BRIDGE_MESSAGE_MARKER]: true;
	direction: BridgeDirection;
	control: typeof BRIDGE_CONTROL_REQUEST_CONTEXT;
};

/**
 * Transport abstraction so Host/Client work over any carrier: same-window `postMessage` on the
 * product side, iframe/side-panel `postMessage` in the chat iframe. Carries `BridgeMessage` only;
 * `rovo-content-bridge-api` commands travel separately, relayed verbatim by the extension.
 */
export type Transport = {
	send: (message: BridgeMessage | BridgeControlMessage) => void;
	/** Returns an unsubscribe function. */
	subscribe: (handler: (message: BridgeMessage | BridgeControlMessage) => void) => () => void;
};

export const isBridgeMessage = (value: unknown): value is BridgeMessage =>
	typeof value === 'object' &&
	value !== null &&
	(value as Record<string, unknown>)[BRIDGE_MESSAGE_MARKER] === true &&
	typeof (value as BridgeMessage).direction === 'string' &&
	typeof (value as BridgeMessage).payload === 'object' &&
	(value as BridgeMessage).payload !== null;

export const isBridgeControlMessage = (value: unknown): value is BridgeControlMessage =>
	typeof value === 'object' &&
	value !== null &&
	(value as Record<string, unknown>)[BRIDGE_MESSAGE_MARKER] === true &&
	typeof (value as BridgeControlMessage).direction === 'string' &&
	(value as BridgeControlMessage).control === BRIDGE_CONTROL_REQUEST_CONTEXT &&
	// Mutually exclusive with `isBridgeMessage`: a control message carries no payload to relay, so a
	// message bearing both is treated as a payload and held to the relay policy.
	(value as { payload?: unknown }).payload === undefined;

/** `postMessage`-based transport. Callers override `targetWindow`/`self` for the iframe side. */
export const createWindowTransport = ({
	targetWindow,
	self: selfWindow = window,
	targetOrigin = selfWindow.location.origin,
	acceptOrigin = targetOrigin,
}: {
	targetWindow: Window;
	self?: Window;
	targetOrigin?: string;
	/**
	 * The only origin whose messages `subscribe` dispatches. Defaults to `targetOrigin`, which is
	 * right for both halves of the bridge: each has exactly one peer, and it is the same peer in
	 * both directions.
	 *
	 * `'*'` is refused. A wildcard here would let anything able to reach this window inject context
	 * that drives editor writes. It disables `subscribe` rather than throwing, because the bridge
	 * must never break the page it runs on.
	 */
	acceptOrigin?: string;
}): Transport => ({
	send: (message) => {
		targetWindow.postMessage(message, targetOrigin);
	},
	subscribe: (handler) => {
		if (acceptOrigin === '*') {
			return () => {};
		}
		// `bind` returns its own unbind function, which is exactly the `subscribe` contract.
		return bind(selfWindow, {
			type: 'message',
			listener: (event) => {
				if (event.origin !== acceptOrigin) {
					return;
				}
				if (isBridgeMessage(event.data) || isBridgeControlMessage(event.data)) {
					handler(event.data);
				}
			},
		});
	},
});

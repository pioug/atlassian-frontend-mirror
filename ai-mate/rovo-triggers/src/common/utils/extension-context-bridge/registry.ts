import { type Payload } from '../../../types';
import { type ChatContextPayload } from '../chat-context/types';

import { BRIDGE_SOURCE } from './constants';
import { isRelayableContextKey } from './policy';
import { type SerializedPayload } from './transport';

const base = (payload: Payload): Omit<SerializedPayload, 'data'> => ({
	type: payload.type,
	source: payload.source,
	product: payload.product,
	openChat: payload.openChat,
});

/**
 * Boundary cast: the `Payload` union cannot be expressed structurally at this seam.
 * Always stamps the loop-guard sentinel so the mirroring side skips it.
 */
const toPayload = (value: Record<string, unknown>): Payload =>
	// eslint-disable-next-line @atlaskit/platform/no-double-type-assertions -- serialization boundary reconstruction
	({ ...value, interactionSource: BRIDGE_SOURCE }) as unknown as Payload;

/**
 * Per-type overrides for payloads carrying non-cloneable data (functions). Anything not listed
 * uses the generic JSON (de)serializer.
 */
type Shim = {
	serialize: (payload: Payload) => SerializedPayload | null;
	deserialize: (serialized: SerializedPayload) => Payload | null;
};

/** Sentinel used to detect merge-style `setContext` implementations. */
const MERGE_PROBE_KEY = '__rovoExtBridgeMergeProbe__';

const SHIMS = {
	/**
	 * `set-message-context` carries a `setContext` function, which cannot be structured-cloned.
	 * Resolves REPLACE-style publishers (return a fixed value) to their value and rebuilds a
	 * trivial `setContext` on the far side; merge-style publishers are dropped (detected via a
	 * probe object, since a throw-based check would silently ship a truncated context).
	 */
	'set-message-context': {
		serialize: (payload) => {
			const data = (payload as { data?: ChatContextPayload }).data;
			if (!data || typeof data.setContext !== 'function') {
				return null;
			}
			// Checked before `setContext` runs, so a non-allowlisted key never invokes product code.
			if (!isRelayableContextKey(data.contextKey)) {
				return null;
			}
			let value: unknown;
			try {
				value = data.setContext({ [MERGE_PROBE_KEY]: true } as never);
			} catch {
				return null;
			}
			// Sentinel survived: merge-style, cannot be resolved to a standalone value.
			if (typeof value === 'object' && value !== null && MERGE_PROBE_KEY in value) {
				return null;
			}
			try {
				JSON.stringify(value);
			} catch {
				return null;
			}
			return { ...base(payload), data: { contextKey: data.contextKey, value } };
		},
		deserialize: (serialized) => {
			const data = serialized.data as { contextKey: string; value: unknown } | undefined;
			if (!data) {
				return null;
			}
			const rebuilt: ChatContextPayload = {
				contextKey: data.contextKey,
				setContext: () => data.value as never,
			};
			return toPayload({
				type: 'set-message-context',
				source: serialized.source ?? BRIDGE_SOURCE,
				product: serialized.product,
				openChat: serialized.openChat,
				data: rebuilt,
			});
		},
	},
} satisfies Partial<Record<Payload['type'], Shim>>;

const getShim = (type: Payload['type']): Shim | undefined =>
	(SHIMS as Partial<Record<Payload['type'], Shim>>)[type];

/** Serialise a payload for the wire, using a shim if one exists, else a generic JSON round-trip. */
export const serializePayload = (payload: Payload): SerializedPayload | null => {
	const shim = getShim(payload.type);
	if (shim) {
		return shim.serialize(payload);
	}
	const rawData = (payload as { data?: unknown }).data;
	let data: unknown;
	try {
		data = rawData === undefined ? undefined : JSON.parse(JSON.stringify(rawData));
	} catch {
		return null;
	}
	return { ...base(payload), data };
};

/** Reconstruct a payload from the wire, stamping the loop-guard sentinel. */
export const deserializePayload = (serialized: SerializedPayload): Payload | null => {
	const shim = getShim(serialized.type);
	if (shim) {
		return shim.deserialize(serialized);
	}
	return toPayload({
		type: serialized.type,
		source: serialized.source ?? BRIDGE_SOURCE,
		product: serialized.product,
		openChat: serialized.openChat,
		data: serialized.data,
	});
};

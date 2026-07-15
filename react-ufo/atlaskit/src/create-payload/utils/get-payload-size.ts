import { fg } from '@atlaskit/platform-feature-flags';

export const SAFE_PAYLOAD_SIZE_GATE = 'platform_ufo_safe_payload_size';
const SERIALIZATION_FAILED_PAYLOAD_SIZE_KB = 1024;

// Reusable TextEncoder instance to avoid creating new instances
const textEncoder = new TextEncoder();

type PayloadSizeSerializationState = {
	seen: WeakSet<object>;
	usedSafeSerializer: boolean;
};

export type PayloadSizeResult = {
	sizeInKb: number;
	usedSafeSerializer: boolean;
	serializationFailed: boolean;
};

function getStringSizeInKb(value: string): number {
	return Math.round(textEncoder.encode(value).length / 1024);
}

function isReactInternalProperty(key: string): boolean {
	return (
		key.startsWith('__reactFiber$') ||
		key.startsWith('__reactProps$') ||
		key.startsWith('__reactContainer$')
	);
}

function isDomNode(value: object): value is Node {
	return typeof Node !== 'undefined' && value instanceof Node;
}

function getDomNodePlaceholder(value: Node): string {
	return `[DOMNode:${value.nodeName || 'unknown'}]`;
}

function createSafePayloadSizeReplacer(state: PayloadSizeSerializationState) {
	return function safePayloadSizeReplacer(key: string, value: unknown): unknown {
		if (isReactInternalProperty(key)) {
			state.usedSafeSerializer = true;
			return '[ReactInternal]';
		}

		if (typeof value === 'bigint') {
			state.usedSafeSerializer = true;
			return '[BigInt]';
		}

		if (typeof value === 'object' && value !== null) {
			if (isDomNode(value)) {
				state.usedSafeSerializer = true;
				return getDomNodePlaceholder(value);
			}

			if (state.seen.has(value)) {
				state.usedSafeSerializer = true;
				return '[Circular]';
			}
			state.seen.add(value);
		}

		return value;
	};
}

function getSafePayloadSize(payload: object): PayloadSizeResult {
	try {
		const state: PayloadSizeSerializationState = {
			seen: new WeakSet<object>(),
			usedSafeSerializer: false,
		};
		const json = JSON.stringify(payload, createSafePayloadSizeReplacer(state)) ?? '';

		return {
			sizeInKb: getStringSizeInKb(json),
			usedSafeSerializer: state.usedSafeSerializer,
			serializationFailed: false,
		};
	} catch {
		return {
			sizeInKb: SERIALIZATION_FAILED_PAYLOAD_SIZE_KB,
			usedSafeSerializer: true,
			serializationFailed: true,
		};
	}
}

function getPayloadSizeWithMetadata(payload: object): PayloadSizeResult {
	// Early return for null/undefined to avoid unnecessary processing
	if (!payload) {
		return {
			sizeInKb: 0,
			usedSafeSerializer: false,
			serializationFailed: false,
		};
	}

	if (fg('platform_ufo_safe_payload_size')) {
		return getSafePayloadSize(payload);
	}

	// Preserve legacy behavior behind the feature gate, including throwing when JSON.stringify throws.
	return {
		sizeInKb: getStringSizeInKb(JSON.stringify(payload) ?? ''),
		usedSafeSerializer: false,
		serializationFailed: false,
	};
}

export default function getPayloadSize<IncludeMetadata extends boolean | undefined = undefined>(
	payload: object,
	options?: { includeMetadata?: IncludeMetadata },
): IncludeMetadata extends true ? PayloadSizeResult : number {
	const result = getPayloadSizeWithMetadata(payload);
	return (options?.includeMetadata ? result : result.sizeInKb) as IncludeMetadata extends true
		? PayloadSizeResult
		: number;
}

/** Selected-unit exposure keys and bounded per-client admission windows. */
import type { ExposureMappingInput } from './mapper';
import { DEFAULT_DEDUPE_MAX_KEYS, DEFAULT_DEDUPE_WINDOW_MS } from './options';

/** Compatibility name retained for the package's existing internal dedupe tests. */
export const DEDUPLICATION_WINDOW_MS: number = DEFAULT_DEDUPE_WINDOW_MS;

/** Previous internal identity helper; local admission now uses `serializeExposureIdentity`. */
export interface ExposureIdentityParts {
	readonly flagKey: string;
	readonly variationId: string | null;
	readonly ruleId: string | null;
	readonly matchReason: string;
	readonly identifiersKey: string;
}

export function exposureIdentifiersKey(
	identifiers: readonly (readonly [name: string, value: string])[],
): string {
	return JSON.stringify([...identifiers].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

export function exposureIdentityKey(parts: ExposureIdentityParts): string {
	return JSON.stringify([
		parts.flagKey,
		parts.variationId,
		parts.ruleId,
		parts.matchReason,
		parts.identifiersKey,
	]);
}

/**
 * Capture the stable identity used for browser admission and wire hashing. Missing original identity
 * fields encode as null.
 */
export function serializeExposureIdentity(input: ExposureMappingInput): string | null {
	try {
		const { details, flagResult, requestContext } = input;

		const metadata = details.metadata;
		const flagKey = metadata.flagKey;
		const matchReason = metadata.matchReason;
		const randomizationIdentifier = nullableIdentifierName(
			metadata.randomizationIdentifierName ?? flagResult?.metadata.randomizationIdentifierName,
		);
		if (
			!isNonEmptyString(flagKey) ||
			!isNonEmptyString(matchReason) ||
			randomizationIdentifier === INVALID
		) {
			return null;
		}

		const randomizationIdentifierValue = requestIdentifierValue(
			requestContext?.identifiers,
			randomizationIdentifier,
		);

		const ruleId = nullableString(metadata.ruleId);
		const variationId = nullableString(metadata.variationId);
		if (ruleId === INVALID || variationId === INVALID) return null;

		const holdout =
			metadata.holdoutAllocation === undefined
				? flagResult?.metadata.holdoutAllocation
				: metadata.holdoutAllocation;
		const holdoutAllocation = holdoutIdentity(holdout, requestContext?.identifiers);
		if (holdoutAllocation === INVALID) return null;

		const outcome =
			metadata.stableSplitOutcome === undefined
				? flagResult?.metadata.stableSplitOutcome
				: metadata.stableSplitOutcome;
		let stableSplitOutcome: Record<string, unknown> | null = null;
		if (outcome !== null && outcome !== undefined) {
			const counterfactualVariationId = nullableString(outcome.variationId);
			const counterfactualReason = outcome.matchReason;
			const counterfactualHoldout = holdoutIdentity(
				outcome.holdoutAllocation,
				requestContext?.identifiers,
			);
			if (
				counterfactualVariationId === INVALID ||
				!isNonEmptyString(counterfactualReason) ||
				counterfactualHoldout === INVALID
			)
				return null;
			stableSplitOutcome = {
				variationId: counterfactualVariationId,
				matchReason: counterfactualReason,
				holdoutAllocation: counterfactualHoldout,
			};
		}

		const identity = {
			flagKey,
			randomizationIdentifier,
			randomizationIdentifierValue,
			ruleId,
			variationId,
			matchReason,
			returnType: flagResult?.returnType ?? null,
			value: details.value,
			holdoutAllocation,
			stableSplitOutcome,
		};
		return canonicalizeJson(identity);
	} catch {
		return null;
	}
}
const INVALID = Symbol('invalid');

/** Each actual or hypothetical holdout captures its own original randomization unit. */
function holdoutIdentity(
	holdout: unknown,
	identifiers: Readonly<Record<string, string>> | undefined,
): Record<string, unknown> | null | typeof INVALID {
	if (holdout === null || holdout === undefined) return null;
	if (typeof holdout !== 'object') return INVALID;
	const source = holdout as Record<string, unknown>;
	const holdoutKey = source.holdoutKey;
	const holdoutRuleId = nullableString(source.holdoutRuleId);
	const identifierType = nullableIdentifierName(source.identifierType);
	const allocationReason = source.allocationReason;
	if (
		!isNonEmptyString(holdoutKey) ||
		holdoutRuleId === INVALID ||
		identifierType === INVALID ||
		!isNonEmptyString(allocationReason)
	)
		return INVALID;
	return {
		holdoutKey,
		holdoutRuleId,
		identifierType,
		allocationReason,
		identifierValue: requestIdentifierValue(identifiers, identifierType),
	};
}

/** Optional IDs are explicitly null in the canonical envelope. */
function nullableString(value: unknown): string | null | typeof INVALID {
	if (value === undefined || value === null) return null;
	return typeof value === 'string' ? value : INVALID;
}

/** Browser missing/empty identity names intentionally share the explicit null representation. */
function nullableIdentifierName(value: unknown): string | null | typeof INVALID {
	const name = nullableString(value);
	return name === '' ? null : name;
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}

function requestIdentifierValue(
	identifiers: Readonly<Record<string, string>> | undefined,
	name: string | null,
): string | null {
	if (identifiers === undefined || name === null || name === 'randomizationId') return null;
	if (!Object.prototype.hasOwnProperty.call(identifiers, name)) return null;
	const value = identifiers[name];
	return typeof value === 'string' ? value : null;
}

/**
 * RFC 8785 (JCS) encoding for supported lossless I-JSON values. ECMAScript JSON.stringify
 * supplies primitive spelling; default string sorting compares raw UTF-16 code units. Members
 * are emitted directly so integer-like property names cannot be reordered by object enumeration.
 * Reject invalid Unicode and unsupported JavaScript representations without invoking user code.
 */
function canonicalizeJson(value: unknown): string | null {
	const ancestors = new Set<object>();

	const encode = (current: unknown): string | null => {
		if (current === null) return 'null';
		if (typeof current === 'string') {
			if (hasUnpairedSurrogate(current)) return null;
			return JSON.stringify(current) ?? null;
		}
		if (typeof current === 'boolean') return current ? 'true' : 'false';
		if (typeof current === 'number') {
			return Number.isFinite(current) ? (JSON.stringify(current) ?? null) : null;
		}
		if (typeof current !== 'object') return null;
		if (ancestors.has(current)) return null;

		ancestors.add(current);
		try {
			if (Array.isArray(current)) {
				if (Object.getPrototypeOf(current) !== Array.prototype) return null;
				const ownKeys = Reflect.ownKeys(current);
				if (
					ownKeys.some(
						(key) =>
							typeof key === 'symbol' || (key !== 'length' && !isArrayIndex(key, current.length)),
					)
				) {
					return null;
				}
				const parts: string[] = [];
				for (let index = 0; index < current.length; index += 1) {
					const descriptor = Object.getOwnPropertyDescriptor(current, String(index));
					if (descriptor === undefined || !('value' in descriptor) || !descriptor.enumerable) {
						return null;
					}
					const part = encode(descriptor.value);
					if (part === null) return null;
					parts.push(part);
				}
				return `[${parts.join(',')}]`;
			}

			const prototype = Object.getPrototypeOf(current);
			if (prototype !== Object.prototype && prototype !== null) return null;
			const keys = Reflect.ownKeys(current);
			if (keys.some((key) => typeof key !== 'string')) return null;
			const stringKeys = (keys as string[]).sort();
			const parts: string[] = [];
			for (const key of stringKeys) {
				const descriptor = Object.getOwnPropertyDescriptor(current, key);
				if (descriptor === undefined || !('value' in descriptor) || !descriptor.enumerable) {
					return null;
				}
				if (hasUnpairedSurrogate(key)) return null;
				const part = encode(descriptor.value);
				if (part === null) return null;
				parts.push(`${JSON.stringify(key)}:${part}`);
			}
			return `{${parts.join(',')}}`;
		} finally {
			ancestors.delete(current);
		}
	};

	return encode(value);
}

function isArrayIndex(key: string | symbol, length: number): boolean {
	if (typeof key !== 'string' || key === '') return false;
	const index = Number(key);
	return Number.isInteger(index) && index >= 0 && index < length && String(index) === key;
}

function hasUnpairedSurrogate(value: string): boolean {
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code >= 0xd800 && code <= 0xdbff) {
			const next = value.charCodeAt(index + 1);
			if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
			index += 1;
		} else if (code >= 0xdc00 && code <= 0xdfff) {
			return true;
		}
	}
	return false;
}

interface WindowEntry {
	key: string;
	lastAdmittedAt: number;
	itemCount: number;
	previous: WindowEntry | undefined;
	next: WindowEntry | undefined;
}

/**
 * A lazily grown, per-client LRU of digest keys. The map provides lookup; inline links track
 * recency without deleting/reinserting map entries on hits. Count drains leave ordering unchanged.
 * Admission windows never remove entries or discard their pending counts. At capacity, reuse the
 * evicted node so sustained churn does not allocate another entry object on every miss.
 */
export class ExposureDeduplicator {
	private readonly entries = new Map<string, WindowEntry>();
	private leastRecent: WindowEntry | undefined;
	private mostRecent: WindowEntry | undefined;
	private clockOrigin: number | undefined;
	private lastElapsedMs = 0;
	private readonly maxKeys: number;
	private readonly windowMs: number;

	constructor(
		maxKeys: number = DEFAULT_DEDUPE_MAX_KEYS,
		windowMs: number = DEDUPLICATION_WINDOW_MS,
	) {
		this.maxKeys = maxKeys;
		this.windowMs = windowMs;
	}

	/** Touch on every admission lookup; suppressions do not slide the admission window. */
	admit(key: string, nowMs: number): boolean {
		if (!Number.isFinite(nowMs)) return true;
		this.clockOrigin ??= nowMs;
		// Prefer the host's monotonic clock; clamp a backwards wall-clock fallback without clearing.
		const elapsedMs = Math.max(this.lastElapsedMs, nowMs - this.clockOrigin);
		this.lastElapsedMs = elapsedMs;

		const existing = this.entries.get(key);
		if (existing !== undefined) {
			if (existing !== this.mostRecent) {
				this.detach(existing);
				this.append(existing);
			}
			if (elapsedMs - existing.lastAdmittedAt < this.windowMs) {
				existing.itemCount = Math.min(existing.itemCount + 1, Number.MAX_SAFE_INTEGER);
				return false;
			}
			existing.lastAdmittedAt = elapsedMs;
			return true;
		}

		let entry: WindowEntry;
		const oldest = this.leastRecent;
		if (this.entries.size >= this.maxKeys && oldest !== undefined) {
			this.entries.delete(oldest.key);
			this.detach(oldest);
			oldest.key = key;
			oldest.lastAdmittedAt = elapsedMs;
			oldest.itemCount = 1;
			entry = oldest;
		} else {
			entry = {
				key,
				lastAdmittedAt: elapsedMs,
				itemCount: 1,
				previous: undefined,
				next: undefined,
			};
		}
		this.append(entry);
		this.entries.set(key, entry);
		return true;
	}

	/** Read/reset the count without consulting time, touching recency, or recreating absent keys. */
	drainItemCount(key: string): number {
		const entry = this.entries.get(key);
		if (entry === undefined) return 1;
		const itemCount = entry.itemCount;
		entry.itemCount = 1;
		return itemCount;
	}

	/** Release every retained key and count on explicit client context replacement. */
	clear(): void {
		this.entries.clear();
		this.leastRecent = undefined;
		this.mostRecent = undefined;
	}

	/** Remove a retained node from the ordering before promoting or reusing it. */
	private detach(entry: WindowEntry): void {
		if (entry.previous === undefined) this.leastRecent = entry.next;
		else entry.previous.next = entry.next;
		if (entry.next === undefined) this.mostRecent = entry.previous;
		else entry.next.previous = entry.previous;
	}

	/** Append as MRU; also handles the empty list and overwrites links on a reused node. */
	private append(entry: WindowEntry): void {
		entry.previous = this.mostRecent;
		entry.next = undefined;
		if (this.mostRecent === undefined) this.leastRecent = entry;
		else this.mostRecent.next = entry;
		this.mostRecent = entry;
	}
}

/** Exposure deduplication windows. Not part of the public API. */

/** How long an identity's queued exposure suppresses later ones with the same identity. */
export const DEDUPLICATION_WINDOW_MS = 600_000;

/** The details members and record identifiers an exposure's deduplication identity is built from. */
export interface ExposureIdentityParts {
	readonly flagKey: string;
	readonly variationId: string | null;
	readonly ruleId: string | null;
	readonly matchReason: string;
	/**
	 * The `exposureIdentifiersKey` of the identifiers the exposure record carries, so different users
	 * never share a window.
	 */
	readonly identifiersKey: string;
}

/**
 * The identifier part of a deduplication identity. Identifiers are sorted by name, so their order
 * does not matter. They change only with state, so callers can reuse it across reads.
 */
export function exposureIdentifiersKey(
	identifiers: readonly (readonly [name: string, value: string])[],
): string {
	return JSON.stringify([...identifiers].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/**
 * The deduplication identity of an exposure. Absent members are encoded as `null`, so they never
 * collide with a present value.
 */
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
 * Tracks one window per identity. The map is unbounded because v1 accepts no limits; distinct flag
 * outcomes per page bound it in practice.
 */
export class ExposureDeduplicator {
	private readonly windowStarts = new Map<string, number>();

	/**
	 * Whether an exposure produced at `nowMs` should be queued. Admitting it starts a new window, so
	 * later exposures with the same identity are discarded until the window has passed. A clock that
	 * moves back before the window's start also ends it, so suppression never outlasts the window.
	 */
	admit(identityKey: string, nowMs: number): boolean {
		const start = this.windowStarts.get(identityKey);
		if (start !== undefined && nowMs >= start && nowMs - start <= DEDUPLICATION_WINDOW_MS) {
			return false;
		}
		this.windowStarts.set(identityKey, nowMs);
		return true;
	}

	/** End the window `admit` just started, for an exposure that was not queued after all. */
	forget(identityKey: string): void {
		this.windowStarts.delete(identityKey);
	}

	/** End every window, as a successful replacement requires. */
	clear(): void {
		this.windowStarts.clear();
	}
}

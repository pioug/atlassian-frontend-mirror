/**
 * Capture a deeply frozen copy of a validated payload, or `null` when it cannot be copied.
 *
 * `prepare` receives the private copy before it is frozen, so derived members are computed from the
 * copy rather than from another read of the caller's object.
 */
export function capturePayload<T extends object, R extends object = T>(
	payload: T,
	prepare?: (copy: T) => R,
): R | null {
	const clonedPayload = clonePayload(payload);
	if (clonedPayload === null) {
		return null;
	}
	const prepared = prepare === undefined ? (clonedPayload as unknown as R) : prepare(clonedPayload);
	return deepFreeze(prepared);
}

function clonePayload<T extends object>(payload: T): T | null {
	try {
		return structuredClone(payload);
	} catch {
		try {
			return JSON.parse(JSON.stringify(payload)) as T;
		} catch {
			return null;
		}
	}
}

function deepFreeze<T>(value: T, seen: WeakSet<object> = new WeakSet<object>()): T {
	if (!isObjectLike(value) || seen.has(value)) {
		return value;
	}

	seen.add(value);
	for (const propertyValue of Object.values(value)) {
		deepFreeze(propertyValue, seen);
	}

	return Object.freeze(value);
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

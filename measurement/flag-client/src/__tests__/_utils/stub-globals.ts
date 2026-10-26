/**
 * Jest stand-ins for Vitest's `vi.stubGlobal` and `vi.unstubAllGlobals`.
 *
 * `stubGlobal` replaces a `globalThis` property for the current test, remembering the original
 * descriptor the first time a name is stubbed; `unstubAllGlobals` restores every stubbed name, deleting
 * properties that did not exist before.
 */

const originals = new Map<string, PropertyDescriptor | undefined>();

/** Replace `globalThis[name]` with `value` until `unstubAllGlobals` is called. */
export function stubGlobal(name: string, value: unknown): void {
	if (!originals.has(name)) {
		originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
	}
	Object.defineProperty(globalThis, name, {
		configurable: true,
		enumerable: true,
		writable: true,
		value,
	});
}

/** Restore every global replaced by `stubGlobal`. */
export function unstubAllGlobals(): void {
	for (const [name, descriptor] of originals) {
		if (descriptor === undefined) {
			Reflect.deleteProperty(globalThis, name);
		} else {
			Object.defineProperty(globalThis, name, descriptor);
		}
	}
	originals.clear();
}

/**
 * Deeply merges source objects into the target object.
 * Handles nested objects, but arrays are not handled (replaced).
 */
export function deepAssign<T, U>(target: T, s: U): T & U;
export function deepAssign<T, U, V>(target: T, s1: U, s2: V): T & U & V;
export function deepAssign<T, U, V, W>(target: T, s1: U, s2: V, s3: W): T & U & V & W;
export function deepAssign(target: any, ...sources: any[]): any {
	if (!sources.length) return target;
	const source = sources.shift();

	if (source === undefined || source === null) {
		return deepAssign(target, ...(sources as [any]));
	}

	for (const [key, src] of Object.entries(source)) {
		const dst = target[key];
		const srcIsObj = src && typeof src === 'object' && !Array.isArray(src);
		const dstIsObj = dst && typeof dst === 'object' && !Array.isArray(dst);
		if (srcIsObj && dstIsObj) {
			target[key] = deepAssign(dst, src);
		} else {
			target[key] = src;
		}
	}

	return deepAssign(target, ...(sources as [any]));
}

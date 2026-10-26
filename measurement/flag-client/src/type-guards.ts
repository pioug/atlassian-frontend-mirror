/** Shared internal type guards. Not part of the public API. */

/** Whether a value is a string primitive. */
export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

/** Whether an object has its own property, without relying on `Object.hasOwn`. */
export function hasOwn(value: object, property: string): boolean {
	return Object.prototype.hasOwnProperty.call(value, property);
}

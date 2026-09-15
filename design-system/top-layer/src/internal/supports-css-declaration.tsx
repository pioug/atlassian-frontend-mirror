import once from '@atlaskit/ds-lib/once';

/**
 * A lazy, cached `CSS.supports(property, value)` probe. Lazy so it is SSR safe
 * and cannot cause a hydration mismatch: nothing is read until the first call,
 * which happens in an effect. Cached because the answer cannot change within a
 * page. `false` wherever `CSS.supports` is missing (SSR, jsdom), so a caller
 * falls back rather than throws.
 */
export function createCssDeclarationProbe({
	property,
	value,
}: {
	property: string;
	value: string;
}): () => boolean {
	return once(function supportsCssDeclaration(): boolean {
		if (
			typeof window === 'undefined' ||
			typeof CSS === 'undefined' ||
			typeof CSS.supports !== 'function'
		) {
			return false;
		}
		return CSS.supports(property, value);
	});
}

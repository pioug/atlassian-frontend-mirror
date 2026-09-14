import type { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { NodeContent } from '../types';

/**
 * Builds the `getContent` node prop: `fragment.toJSON()` computed on first call and memoized for
 * the lifetime of the props object it is attached to.
 *
 * A prop getter cannot achieve the same deferral: `getProps`' callers spread its result and React
 * copies props again on element creation, so a getter would run before any component reads it.
 */
export const createContentGetter = (
	fragment: Fragment | undefined,
): (() => NodeContent | undefined) => {
	let serialized: NodeContent | undefined;
	let materialized = false;

	return () => {
		if (!materialized) {
			serialized = fragment ? fragment.toJSON() : undefined;
			// Set last: if `toJSON()` throws, the error propagates and a retry re-attempts instead of
			// caching a partial result.
			materialized = true;
		}
		return serialized;
	};
};

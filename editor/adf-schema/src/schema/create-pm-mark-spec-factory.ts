import type { Mark, MarkSpec } from '@atlaskit/editor-prosemirror/model';

import type { MarkSpecOptions } from './createPMSpecFactory';

/**
 * Factory method to attach custom parseDOM and/or toDOM for markSpec
 *
 * @example
 * createPMMarkSpecFactory<SomeMark>(mark)({parseDOM: {}, toDOM: (mark, inline) => {} });
 *
 * @param markSpec - Markspec without toDom and parseDom
 * @returns A function for a mark which allows the consumer to define toDom and parseDom
 */
export const createPMMarkSpecFactory =
	<M extends Omit<Mark, 'toDOM' | 'parseDOM'>>(markSpec: MarkSpec) =>
	({ parseDOM, toDOM, toDebugString }: MarkSpecOptions<M>): MarkSpec => {
		// @ts-ignore
		return {
			...markSpec,
			...(parseDOM && {
				parseDOM,
			}),
			...(toDOM && {
				toDOM,
			}),
			...(toDebugString && {
				toDebugString,
			}),
		};
	};

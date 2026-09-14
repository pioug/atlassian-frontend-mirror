import type { Node as PMNode, NodeSpec } from '@atlaskit/editor-prosemirror/model';

import type { NodeSpecOptions } from './createPMSpecFactory';

/**
 * Factory method to attach custom parseDOM and/or toDOM for nodeSpec
 *
 * @example
 * createPMNodeSpecFactory<SomeNode>(node)({parseDOM: {}, toDOM: (node) => {} });
 *
 * @param nodeSpec - NodeSpec without toDom and parseDom
 * @returns A function for a node which allows the consumer to define toDom and parseDom
 */
export const createPMNodeSpecFactory =
	<N extends Omit<PMNode, 'toDOM' | 'parseDOM'>>(nodeSpec: NodeSpec) =>
	({ parseDOM, toDOM, toDebugString }: NodeSpecOptions<N>): NodeSpec => {
		// @ts-ignore
		return {
			...nodeSpec,
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

import type {
	DOMOutputSpec,
	Node as PMNode,
	NodeSpec,
	Mark,
	MarkSpec,
} from '@atlaskit/editor-prosemirror/model';

export type NodeSpecOptions<N extends PMNode> = {
	parseDOM?: NodeSpec['parseDOM'];
	toDebugString?: () => string;
	toDOM?: (node: N) => DOMOutputSpec;
};

export type NodeSpecFactory = typeof createPMNodeSpecFactory;

export type MarkSpecOptions<M extends Mark> = {
	parseDOM?: MarkSpec['parseDOM'];
	toDebugString?: () => string;
	toDOM?: (mark: M, inline: boolean) => DOMOutputSpec;
};

export type MarkSpecFactory = typeof createPMMarkSpecFactory;

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

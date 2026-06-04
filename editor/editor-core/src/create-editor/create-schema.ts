import { sanitizeNodes } from '@atlaskit/adf-schema/schema';
import { sortByOrder } from '@atlaskit/editor-common/legacy-rank-plugins';
import type { MarkConfig, NodeConfig } from '@atlaskit/editor-common/types';
import type {
	DOMOutputSpec,
	MarkSpec,
	NodeSpec,
	Mark as PMMark,
	Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { Schema } from '@atlaskit/editor-prosemirror/model';

import { addMetadataAttributes } from './addMetadataAttributes';
import { fixExcludes } from './fixExcludes';
type toDOMType = (node: PMNode | PMMark) => DOMOutputSpec;

/**
 * 🧱 Internal Helper Function: Editor FE Platform
 *
 * Wraps a `toDOM` function with a proxy that automatically adds metadata attributes
 * to the resulting DOMOutputSpec. This is useful for dynamically enhancing the output
 * of a `toDOM` function with additional context.
 *
 * @param {function(PMNode | PMMark): DOMOutputSpec} toDOM - The original `toDOM` function.
 * @returns {function(PMNode | PMMark): DOMOutputSpec} A proxied `toDOM` function that adds metadata attributes.
 */
export const wrapToDOMProxy = (toDOM: toDOMType): toDOMType => {
	return new Proxy(toDOM, {
		apply(target, thisArg, argumentsList) {
			const domSpec: ReturnType<toDOMType> = Reflect.apply(target, thisArg, argumentsList);

			if (!Array.isArray(domSpec)) {
				return domSpec;
			}

			const nodeOrMark = argumentsList[0];
			return addMetadataAttributes({ nodeOrMark, domSpec });
		},
	});
};

/**
 * 🧱 Internal Helper Function: Editor FE Platform
 *
 * Wraps a NodeSpec or MarkSpec object with a proxy to enhance its `toDOM` method.
 * This proxy automatically adds metadata attributes to the DOM output of the `toDOM` method,
 * enriching the DOM representation with additional ProseMirror-specific metadata.
 *
 * For nodes thats use NodeViews, you can find the implementation of those attributes on this file:
 * @see `packages/editor/editor-common/src/safe-plugin/index.ts`
 *
 * @template T
 * @param {T} spec - The NodeSpec or MarkSpec object to be wrapped.
 * @returns {T} A proxied NodeSpec or MarkSpec object where the `toDOM` method is enhanced
 * with metadata attributes.
 */
export const wrapNodeSpecProxy = <T extends NodeSpec | MarkSpec>(spec: T): T => {
	return new Proxy<T>(spec, {
		get(target, prop, receiver) {
			const result = Reflect.get(target, prop, receiver);

			if (prop === 'toDOM' && typeof result === 'function') {
				return wrapToDOMProxy(result);
			}

			return result;
		},
	});
};

export function createSchema(editorConfig: {
	marks: MarkConfig[];
	nodes: NodeConfig[];
}): Schema<string, string> {
	const marks = fixExcludes(
		editorConfig.marks.sort(sortByOrder('marks')).reduce(
			(acc, mark) => {
				acc[mark.name] = wrapNodeSpecProxy(mark.mark);
				return acc;
			},
			{} as { [nodeName: string]: MarkSpec },
		),
	);
	const nodes = sanitizeNodes(
		editorConfig.nodes.sort(sortByOrder('nodes')).reduce(
			(acc, node) => {
				acc[node.name] = wrapNodeSpecProxy(node.node);
				return acc;
			},
			{} as { [nodeName: string]: NodeSpec },
		),
		marks,
	);

	return new Schema({ nodes, marks });
}

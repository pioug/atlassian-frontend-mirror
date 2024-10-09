import { createProseMirrorMetadata } from '@atlaskit/editor-common/prosemirror-dom-metadata';
import type {
	DOMOutputSpec,
	MarkSpec,
	NodeSpec,
	Mark as PMMark,
	Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import { Schema } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MarkConfig, NodeConfig } from '../types/pm-config';
import { sanitizeNodes } from '../utils/sanitizeNodes';

import { fixExcludes } from './create-editor';
import { sortByOrder } from './sort-by-order';

type toDOMType = (node: PMNode | PMMark) => DOMOutputSpec;

/**
 * 🧱 Internal Helper Function: Editor FE Platform
 *
 * Adds generic metadata attributes to a DOMOutputSpec array based on the provided node or mark.
 * This function ensures that the DOMOutputSpec is annotated with ProseMirror-specific metadata.
 *
 * @param {Object} params - Parameters object.
 * @param {PMNode | PMMark} params.nodeOrMark - The ProseMirror node or mark to extract metadata from.
 * @param {DOMOutputSpec} params.domSpec - The DOMOutputSpec to which attributes will be added.
 * @returns {DOMOutputSpec} The modified DOMOutputSpec with additional metadata.
 */
export const addMetadataAttributes = ({
	nodeOrMark,
	domSpec,
}: {
	nodeOrMark: PMNode | PMMark;
	domSpec: DOMOutputSpec;
}): DOMOutputSpec => {
	if (!Array.isArray(domSpec)) {
		return domSpec;
	}

	const maybeDefinedAttributes = domSpec[1];
	const metadata = createProseMirrorMetadata(nodeOrMark);
	const hasDefinedAttributes =
		typeof maybeDefinedAttributes === 'object' && !Array.isArray(maybeDefinedAttributes);

	if (hasDefinedAttributes) {
		domSpec[1] = Object.assign(maybeDefinedAttributes, metadata);
	} else {
		domSpec.splice(1, 0, metadata);
	}

	return domSpec;
};

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

export function createSchema(editorConfig: { marks: MarkConfig[]; nodes: NodeConfig[] }) {
	const marks = fixExcludes(
		editorConfig.marks.sort(sortByOrder('marks')).reduce(
			(acc, mark) => {
				if (fg('platform_editor_breakout_use_css')) {
					acc[mark.name] = wrapNodeSpecProxy(mark.mark);
				} else {
					acc[mark.name] = mark.mark;
				}
				return acc;
			},
			{} as { [nodeName: string]: MarkSpec },
		),
	);
	const nodes = sanitizeNodes(
		editorConfig.nodes.sort(sortByOrder('nodes')).reduce(
			(acc, node) => {
				if (fg('platform_editor_breakout_use_css')) {
					acc[node.name] = wrapNodeSpecProxy(node.node);
				} else {
					acc[node.name] = node.node;
				}
				return acc;
			},
			{} as { [nodeName: string]: NodeSpec },
		),
		marks,
	);

	return new Schema({ nodes, marks });
}

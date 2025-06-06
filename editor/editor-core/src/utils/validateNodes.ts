import { type Node as PMNode, Mark } from '@atlaskit/editor-prosemirror/model';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

// We don't want to use memoize from lodash, because we need to use WeakMap or WeakSet
// to avoid memory leaks, but lodash allow to change the cache type only globally
// like `memoize.Cache = WeakMap`, and we don't want to do that.
// So we use our own cache implementation.
const cache = new WeakSet<PMNode>();

// See https://github.com/ProseMirror/prosemirror-model/blob/20d26c9843d6a69a1d417d937c401537ee0b2342/src/node.ts#L303
function checkNode(node: PMNode): void {
	if (cache.has(node)) {
		return;
	}

	// @ts-expect-error - This is internal ProseMirror API, but we okay with it
	node.type.checkContent(node.content);
	// @ts-expect-error - This is internal ProseMirror API, but we okay with it
	node.type.checkAttrs(node.attrs);
	let copy = Mark.none;
	for (let i = 0; i < node.marks.length; i++) {
		const mark = node.marks[i];
		// @ts-expect-error - This is internal ProseMirror API, but we okay with it
		mark.type.checkAttrs(mark.attrs);
		copy = mark.addToSet(copy);
	}
	if (!Mark.sameSet(copy, node.marks)) {
		throw new RangeError(
			`Invalid collection of marks for node ${node.type.name}: ${node.marks.map((m) => m.type.name)}`,
		);
	}

	node.content.forEach((node) => checkNode(node));

	// The set value should be added in the end of the function,
	// because any previous check can throw an error,
	// and we don't want to add invalid node to the cache.
	cache.add(node);
}

export const validNode = (node: PMNode): boolean => {
	try {
		if (editorExperiment('platform_editor_memoized_node_check', true, { exposure: true })) {
			checkNode(node);
		} else {
			node.check();
		}
	} catch (error) {
		return false;
	}
	return true;
};

/** Validates prosemirror nodes, and returns true only if all nodes are valid */
export const validateNodes = (nodes: PMNode[]): boolean => nodes.every(validNode);

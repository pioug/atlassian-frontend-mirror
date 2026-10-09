import type { Node } from '@atlaskit/editor-prosemirror/model';

/** The node to annotate, with the position immediately before it (`doc.nodeAt(pos) === node`). */
type ResolvedAnnotatableTarget = { node: Node; pos: number };

/** Renderer copy of the editor's `isSupportedBlockNode`, kept identical so both resolve alike. */
const isSupportedBlockNode = (node: Node, supportedBlockNodes: string[] = []): boolean => {
	return (
		supportedBlockNodes.indexOf(node.type.name) >= 0 ||
		(node.type.name === 'mediaSingle' && supportedBlockNodes.indexOf('media') >= 0)
	);
};

/**
 * Renderer equivalent of the editor's `resolveAnnotatableTargetFromLocalId`: resolves the node to
 * annotate for a `localId`, climbing to the closest accepting ancestor when the node itself does
 * not accept an annotation. Returns undefined when nothing in the chain accepts one.
 *
 * Kept in sync with the editor implementation so both sides resolve the same node.
 */
export const resolveAnnotatableTargetFromLocalId = (
	doc: Node,
	localId: string,
	opts: { supportedBlockNodes?: string[] } = {},
): ResolvedAnnotatableTarget | undefined => {
	const { supportedBlockNodes } = opts;

	// No `EditorState` here, so walk the doc directly like `findNodePosByLocalIds` does.
	let match: ResolvedAnnotatableTarget | undefined;
	doc.descendants((node: Node, pos: number) => {
		if (match) {
			return false;
		}
		if (node.attrs?.localId === localId) {
			match = { node, pos };
			return false;
		}
		return true;
	});

	if (!match) {
		return undefined;
	}

	const annotationMarkType = doc.type.schema.marks.annotation;
	const nodeAcceptsAnnotation = (node: Node): boolean =>
		(!!annotationMarkType && node.type.allowsMarkType(annotationMarkType)) ||
		isSupportedBlockNode(node, supportedBlockNodes);

	if (nodeAcceptsAnnotation(match.node)) {
		return match;
	}

	// Ancestors only — never descendants.
	const $pos = doc.resolve(match.pos);
	for (let depth = $pos.depth; depth >= 0; depth--) {
		const ancestor = $pos.node(depth);
		if (nodeAcceptsAnnotation(ancestor)) {
			return { node: ancestor, pos: depth === 0 ? 0 : $pos.before(depth) };
		}
	}

	return undefined;
};

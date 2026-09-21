import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

export const TYPE_SURFACE_ANCHOR_DEC = 'block-controls-surface-anchor';
export const SURFACE_ANCHOR_ATTR = 'data-block-controls-surface-anchor';
export const SURFACE_NODE_TYPE_ATTR = 'data-block-controls-surface-node-type';
export const SURFACE_ANCHOR_VARIABLE = '--block-controls-surface-anchor-name';

/**
 * These node views expose the box used by the measured placement fallback rather than their
 * ProseMirror node wrapper. The marker carries the name through a custom property so sparse CSS
 * can name that inner box without adding a widget or changing the node view.
 */
const INNER_CONTENT_NODE_TYPES = new Set([
	'blockCard',
	'bodiedExtension',
	'embedCard',
	'extension',
	'mediaSingle',
	'multiBodiedExtension',
	'table',
]);

export type SurfaceAnchorDecorationSpec = {
	anchorName: string;
	nodeType: string;
	type: typeof TYPE_SURFACE_ANCHOR_DEC;
};

export type SurfaceAnchorDecorationResult = {
	anchors: ReadonlyMap<number, string>;
	decorations: DecorationSet;
};

const getMarkerStyle = (nodeType: string, anchorName: string): string => {
	const inheritedName = `${SURFACE_ANCHOR_VARIABLE}: ${anchorName};`;

	// Inner boxes get their anchor from the sparse global selector. Naming only the node wrapper
	// would position media/table/extension controls against the wrapper instead of visible content.
	return INNER_CONTENT_NODE_TYPES.has(nodeType)
		? inheritedName
		: `${inheritedName} anchor-name: ${anchorName};`;
};

/**
 * Builds sparse CSS anchor decorations from already-qualified cached positions. Anchor identity is
 * supplied by the editor's native node-anchor provider so sparse surfaces and consumers share the
 * same `data-node-anchor`.
 */
export const createSurfaceAnchorDecorations = (
	state: EditorState,
	positions: readonly number[],
	resolveAnchorName: (
		node: PMNode,
		position: number,
		previousAnchorName: string | undefined,
	) => string | undefined,
	previousAnchors?: ReadonlyMap<number, string>,
): SurfaceAnchorDecorationResult => {
	const anchors = new Map<number, string>();
	const decorations: Decoration[] = [];

	for (const position of positions) {
		if (anchors.has(position)) {
			continue;
		}

		const node = state.doc.nodeAt(position);
		if (!node?.isBlock) {
			continue;
		}

		const anchorName = resolveAnchorName(node, position, previousAnchors?.get(position));
		if (!anchorName) {
			continue;
		}
		anchors.set(position, anchorName);
		decorations.push(
			Decoration.node(
				position,
				position + node.nodeSize,
				{
					[SURFACE_ANCHOR_ATTR]: anchorName,
					[SURFACE_NODE_TYPE_ATTR]: node.type.name,
					style: getMarkerStyle(node.type.name, anchorName),
				},
				{
					type: TYPE_SURFACE_ANCHOR_DEC,
					anchorName,
					nodeType: node.type.name,
				},
			),
		);
	}

	return {
		anchors,
		decorations: DecorationSet.create(state.doc, decorations),
	};
};

import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type {
	NodeType,
	Node as PMNode,
	ResolvedPos,
	Schema,
} from '@atlaskit/editor-prosemirror/model';

/**
 * Returns the base name of a node type, stripping known variant suffixes.
 */
const variantToBaseNameMap: Record<string, string> = {
	panel_c1: 'panel',
};

export function getBaseNodeTypeName(nodeType: NodeType): string {
	return variantToBaseNameMap[nodeType.name] ?? nodeType.name;
}

/**
 * Returns true if two node types share the same base type name.
 *
 * Useful for comparing nodes that may exist as schema variants
 * (e.g. `panel` and `panel_c1` are considered the same base type).
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function isNodeOfSameBaseType(a: NodeType, b: NodeType): boolean {
	return getBaseNodeTypeName(a) === getBaseNodeTypeName(b);
}

/**
 * Checks if a node type is a valid child of a parent node by creating a minimal valid
 * instance and validating it against the parent's content expression. Unlike ProseMirror's
 * canReplaceWith, this checks general type compatibility without requiring a specific insertion index.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function isNodeTypeValidChildOf(
	childTypeName: string,
	parentNode: PMNode,
	schema: Schema,
): boolean {
	const childType = schema.nodes[childTypeName];
	if (!childType) {
		return false;
	}
	const candidate = childType.createAndFill();
	if (!candidate) {
		return false;
	}
	return parentNode.type.validContent(Fragment.from(candidate));
}

/**
 * Picks the appropriate panel NodeType for insertion at the current selection
 * or resolved position.
 *
 * Prefers `panel_c1` when the parent can accept it (e.g. when table-in-panel
 * is supported), falls back to `panel` otherwise or at isolating boundaries.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function pickPanelTypeForInsertion($from: ResolvedPos): NodeType {
	const schema = $from.doc.type.schema;
	const { panel, panel_c1 } = schema.nodes;

	if (!panel_c1) {
		return panel;
	}

	for (let depth = $from.depth; depth >= 0; depth--) {
		const parent = $from.node(depth);
		const index = $from.index(depth);
		if (parent.canReplaceWith(index, index, panel_c1)) {
			return panel_c1;
		}
		const spec = parent.type.spec;
		// Stop at isolating containers (e.g. expand, tableCell) — hard walls where
		// the panel stays inside and should use the regular panel type.
		if (spec.isolating) {
			return panel;
		}
	}

	return panel;
}

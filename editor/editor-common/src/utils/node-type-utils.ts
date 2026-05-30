import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';

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
export function isNodeOfSameBaseType(a: NodeType, b: NodeType): boolean {
	return getBaseNodeTypeName(a) === getBaseNodeTypeName(b);
}

/**
 * Checks if a node type is a valid child of a parent node by creating a minimal valid
 * instance and validating it against the parent's content expression. Unlike ProseMirror's
 * canReplaceWith, this checks general type compatibility without requiring a specific insertion index.
 */
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

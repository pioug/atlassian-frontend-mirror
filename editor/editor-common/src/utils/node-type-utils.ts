import type { NodeType } from '@atlaskit/editor-prosemirror/model';

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
// eslint-disable-next-line @atlaskit/editor/no-re-export

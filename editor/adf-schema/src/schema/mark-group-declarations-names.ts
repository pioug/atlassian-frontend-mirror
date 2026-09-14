import type { SchemaBuiltInItem } from './create-schema';
import { COLOR, FONT_STYLE, SEARCH_QUERY, LINK } from './groups';

// We use groups to allow schemas to be constructed in different shapes without changing node/mark
// specs, but this means nodes/marks are defined with groups that might never be used in the schema.
// In this scenario ProseMirror will complain and prevent the schema from being constructed.
function groupDeclaration(name: string): SchemaBuiltInItem {
	return {
		name: `__${name}GroupDeclaration`,
		spec: { group: name },
	};
}

export const markGroupDeclarations: SchemaBuiltInItem[] = [
	groupDeclaration(COLOR),
	groupDeclaration(FONT_STYLE),
	groupDeclaration(SEARCH_QUERY),
	groupDeclaration(LINK),
];

export const markGroupDeclarationsNames: string[] = markGroupDeclarations.map(
	(groupMark) => groupMark.name,
);

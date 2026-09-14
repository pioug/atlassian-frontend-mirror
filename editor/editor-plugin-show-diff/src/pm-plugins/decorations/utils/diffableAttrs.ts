/**
 * Single source of truth for which attributes of a node type represent a
 * meaningful change. Shared by `attrAwareTokenEncoder` (changeset detection)
 * and `getAttrChangeRanges` (decoration rendering) so the two stages agree.
 */
export type DiffableAttrsRule = { include: readonly string[] } | { exclude: readonly string[] };

// `localId` is editor bookkeeping rather than user-visible content. Suggestions can regenerate it,
// so treating it as a diff would create phantom changes.
const DEFAULT_EXCLUDED_ATTRS: readonly string[] = ['localId'];

// Specialised rules keep existing node-specific behaviour. Node types absent from this map use the
// generic fallback and diff every attribute except editor bookkeeping attributes.
export const DIFFABLE_ATTRS_BY_NODE_TYPE: Record<string, DiffableAttrsRule> = {
	tableCell: { include: ['background', 'colspan', 'rowspan'] },
	tableHeader: { include: ['background', 'colspan', 'rowspan'] },

	// Inline nodes whose identity is their attrs.
	date: { include: ['timestamp'] },
	emoji: { include: ['shortName', 'id', 'text'] },
	mention: { include: ['id', 'text'] },
	status: { include: ['text', 'color'] },
	taskItem: { include: ['state'] },

	// Media: id/collection/url identify the image.
	media: { include: ['id', 'collection', 'url'] },

	// Panel: type/colour/icon change is formatting-only but reviewable. Keyed by base
	// node type — the encoder normalises variants (e.g. `panel_c1`) to `panel` first.
	panel: { include: ['panelType', 'panelColor', 'panelIcon', 'panelIconId', 'panelIconText'] },

	// Extensions: any attribute change is meaningful except localId.
	extension: { exclude: ['localId'] },
	inlineExtension: { exclude: ['localId'] },
	bodiedExtension: { exclude: ['localId'] },
};

// Whether `attrName` is a meaningful change for `nodeTypeName`. Nodes without a specialised rule
// diff all attributes except editor bookkeeping attributes.
export const isDiffableAttr = (nodeTypeName: string, attrName: string): boolean => {
	const rule = DIFFABLE_ATTRS_BY_NODE_TYPE[nodeTypeName];
	if (!rule) {
		return !DEFAULT_EXCLUDED_ATTRS.includes(attrName);
	}
	return 'include' in rule ? rule.include.includes(attrName) : !rule.exclude.includes(attrName);
};

// The fixed include list for a node type, or `undefined` for no/exclude rule.
// Use where a node-independent attr list is needed (e.g. the inline node map).
export const getIncludedDiffableAttrs = (nodeTypeName: string): readonly string[] | undefined => {
	const rule = DIFFABLE_ATTRS_BY_NODE_TYPE[nodeTypeName];
	return rule && 'include' in rule ? rule.include : undefined;
};

// Like `getIncludedDiffableAttrs` but asserts the include rule exists, so a
// consumer relying on a fixed list fails loudly if the rule is removed or
// switched to an exclude rule rather than silently drifting.
export const getRequiredIncludedDiffableAttrs = (nodeTypeName: string): readonly string[] => {
	const attrs = getIncludedDiffableAttrs(nodeTypeName);
	if (!attrs) {
		throw new Error(`diffableAttrs: expected an include rule for "${nodeTypeName}"`);
	}
	return attrs;
};

/**
 * Concrete attr names to diff for a node instance, honouring specialised rules and otherwise
 * including every attribute except editor bookkeeping. Attribute names are sorted because key
 * order is not stable across the two diffed documents.
 */
export const getDiffableAttrNames = (
	nodeTypeName: string,
	attrs: Record<string, unknown>,
): readonly string[] | undefined => {
	const rule = DIFFABLE_ATTRS_BY_NODE_TYPE[nodeTypeName];
	if (!rule) {
		return Object.keys(attrs)
			.filter((name) => !DEFAULT_EXCLUDED_ATTRS.includes(name))
			.sort();
	}
	if ('include' in rule) {
		return rule.include;
	}
	return Object.keys(attrs)
		.filter((name) => !rule.exclude.includes(name))
		.sort();
};

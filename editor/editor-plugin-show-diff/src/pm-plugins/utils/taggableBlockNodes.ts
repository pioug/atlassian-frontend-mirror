import type { NodeType } from '@atlaskit/editor-prosemirror/model';

import { resolveBaseNodeName } from './baseNodeName';

/**
 * Block nodes that host a contributor tag of their own — those whose whole box reads as one change.
 * Everything that draws a box whatever it holds, plus the two lists that are inserted whole: without
 * them the tag fell through to the text inside the first item (EDITOR-8932). Bullet and ordered lists
 * are left out, since their items accrue one at a time. Tables and list items decorate per cell and
 * per item, with no one-tag-per-block design yet. `blockCard` covers the datasource variant, which is
 * the same node type.
 *
 * Base names only — match with the predicates below, never against `type.name` directly.
 */
const TAGGABLE_BLOCK_NODES: ReadonlySet<string> = new Set([
	'blockCard',
	'blockquote',
	'bodiedExtension',
	'codeBlock',
	'decisionList',
	'embedCard',
	'expand',
	'extension',
	'media',
	'multiBodiedExtension',
	'panel',
	'rule',
	'taskList',
]);

/**
 * Whether this node hosts a contributor tag of its own. Navigation grouping does not consult this:
 * a run of these one contributor inserted is a single stop, tagged on the leading block.
 *
 * Resolved through `resolveBaseNodeName` so a schema variant counts as the type it is a variant of:
 * `panel_c1` is the panel the table-in-panel schema inserts, and matching on `type.name` left it
 * untagged (EDITOR-8932).
 *
 * By name, because the decoration spec carries `nodeName` rather than the type it came from.
 */
export const isTaggableBlockNodeName = (name: string | undefined): boolean =>
	name !== undefined && TAGGABLE_BLOCK_NODES.has(resolveBaseNodeName(name));

/** As above, from the node type itself. */
export const isTaggableBlockNode = (nodeType: NodeType): boolean =>
	isTaggableBlockNodeName(nodeType.name);

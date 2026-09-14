import type { TokenEncoder } from 'prosemirror-changeset';

import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { getBaseNodeTypeName } from '@atlaskit/editor-common/utils/node-type-utils';

import { getDiffableAttrNames } from '../decorations/utils/diffableAttrs';

import { encodeCharacterWithMarks } from './encodeCharacterWithMarks';

/**
 * Attribute-aware token encoder for `prosemirror-changeset`. The default encoder
 * reduces a node to `node.type.name`, so an attribute-only change (e.g. a table
 * cell recolour) tokenises identically on both sides and goes undetected. This
 * folds the diffable attributes (from the shared `diffableAttrs` map) into the
 * open token so such changes register.
 */

// Stable composite token; attr names are pre-ordered by the caller.
const encodeNodeWithAttrs = (node: PMNode, attrNames: readonly string[]): string => {
	const attrs = node.attrs ?? {};
	const parts = attrNames.map((name) => `${name}=${JSON.stringify(attrs[name] ?? null)}`);
	return `${node.type.name}|${parts.join('|')}`;
};

// Like the library default, but node types with a `diffableAttrs` rule fold their
// attrs into the open token, and text characters fold in their marks. Node-end is
// unchanged, hence `string | number`.
export const attrAwareTokenEncoder: TokenEncoder<string | number> = {
	encodeCharacter: (char: number, marks: readonly Mark[]) => encodeCharacterWithMarks(char, marks),
	encodeNodeStart: (node: PMNode) => {
		// Normalise variants (e.g. `panel_c1` → `panel`) so `diffableAttrs` needs one entry.
		const attrNames = getDiffableAttrNames(getBaseNodeTypeName(node.type), node.attrs ?? {});
		if (attrNames && attrNames.length > 0) {
			return encodeNodeWithAttrs(node, attrNames);
		}
		return node.type.name;
	},
	encodeNodeEnd: (node: PMNode) => -typeID(node.type),
	compareTokens: (a, b) => a === b,
};

// Mirrors the library's private (unexported) `typeID` so node-end tokens match.
function typeID(type: PMNode['type']): number {
	const cache: Record<string, number> =
		type.schema.cached.changeSetIDs || (type.schema.cached.changeSetIDs = Object.create(null));
	let id = cache[type.name];
	if (id == null) {
		cache[type.name] = id = Object.keys(type.schema.nodes).indexOf(type.name) + 1;
	}
	return id;
}

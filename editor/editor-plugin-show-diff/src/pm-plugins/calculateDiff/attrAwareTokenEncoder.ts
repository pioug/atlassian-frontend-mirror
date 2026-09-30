import type { TokenEncoder } from 'prosemirror-changeset';

import { getBaseNodeTypeName } from '@atlaskit/editor-common/utils/node-type-utils';
import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getDiffableAttrNames } from '../decorations/utils/diffableAttrs';
import {
	getComparableExcerptIncludeAttrs,
	isExcerptInclude,
} from '../decorations/utils/excerptIncludeAttrs';
import { encodeCharacterWithMarks } from './encodeCharacterWithMarks';

/**
 * Attribute-aware token encoder for `prosemirror-changeset`. The default encoder
 * reduces a node to `node.type.name`, so an attribute-only change (e.g. a table
 * cell recolour) tokenises identically on both sides and goes undetected. This
 * folds the diffable attributes (from the shared `diffableAttrs` map) into the
 * open token so such changes register.
 */

// Stable composite token; attr names are pre-ordered by the caller.
const encodeNodeWithAttrs = (
	nodeTypeName: string,
	attrs: Record<string, unknown>,
	attrNames: readonly string[],
): string => {
	const parts = attrNames.map((name) => `${name}=${JSON.stringify(attrs[name] ?? null)}`);
	return `${nodeTypeName}|${parts.join('|')}`;
};

// Like the library default, but node types with a `diffableAttrs` rule fold their
// attrs into the open token, and text characters fold in their marks. Node-end is
// unchanged, hence `string | number`.
export const attrAwareTokenEncoder: TokenEncoder<string | number> = {
	encodeCharacter: (char: number, marks: readonly Mark[]) => encodeCharacterWithMarks(char, marks),
	encodeNodeStart: (node: PMNode) => {
		// A one-sided reference is not comparable from an isolated token. Attribute-step comparison
		// checks the reference when both versions have one.
		const attrs =
			fg('platform_editor_normalize_excerpt_diff') &&
			node.type.name === 'extension' &&
			isExcerptInclude(node.attrs)
				? getComparableExcerptIncludeAttrs(node.attrs)
				: node.attrs;
		// Normalise variants (e.g. `panel_c1` → `panel`) so `diffableAttrs` needs one entry.
		const attrNames = getDiffableAttrNames(getBaseNodeTypeName(node.type), attrs ?? {});
		if (attrNames && attrNames.length > 0) {
			return encodeNodeWithAttrs(node.type.name, attrs, attrNames);
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

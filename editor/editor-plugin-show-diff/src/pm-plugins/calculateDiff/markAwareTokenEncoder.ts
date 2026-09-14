import type { TokenEncoder } from 'prosemirror-changeset';

import type { Mark, Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { encodeCharacterWithMarks } from './encodeCharacterWithMarks';

/** Mirrors the library's private (unexported) `typeID` so node-end tokens match. */
const typeID = (type: PMNode['type']): number => {
	const cache: Record<string, number> =
		type.schema.cached.changeSetIDs || (type.schema.cached.changeSetIDs = Object.create(null));
	let id = cache[type.name];
	if (id == null) {
		cache[type.name] = id = Object.keys(type.schema.nodes).indexOf(type.name) + 1;
	}
	return id;
};

/**
 * The library default encoder plus mark folding on text characters.
 *
 * Deliberately narrower than `attrAwareTokenEncoder`: node-start tokens keep the library default
 * and do not fold in diffable attributes, which `getAttrChangeRanges` already reports for every
 * diff type.
 */
export const markAwareTokenEncoder: TokenEncoder<string | number> = {
	encodeCharacter: (char: number, marks: readonly Mark[]) => encodeCharacterWithMarks(char, marks),
	encodeNodeStart: (node: PMNode) => node.type.name,
	encodeNodeEnd: (node: PMNode) => -typeID(node.type),
	compareTokens: (a, b) => a === b,
};

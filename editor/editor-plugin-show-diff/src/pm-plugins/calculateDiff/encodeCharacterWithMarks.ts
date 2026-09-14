import type { Mark } from '@atlaskit/editor-prosemirror/model';

/** U+0000 cannot occur in ProseMirror text content, so a token can never be ambiguous. */
const MARK_KEY_SEPARATOR = '\u0000';

const buildMarkKey = (marks: readonly Mark[]): string =>
	marks
		.map((mark) => {
			const attrs = mark.attrs ?? {};
			const attrParts = Object.keys(attrs)
				.sort()
				.map((key) => `${key}=${JSON.stringify(attrs[key] ?? null)}`);
			return attrParts.length > 0 ? `${mark.type.name}(${attrParts.join(',')})` : mark.type.name;
		})
		.sort()
		.join('&');

/**
 * Keyed on array identity: `prosemirror-changeset` passes the same `child.marks` reference for
 * every character in a text node, so this collapses the key building to once per node.
 */
const markKeyCache = new WeakMap<readonly Mark[], string>();

/**
 * Folds a character's marks into its `prosemirror-changeset` token. The library default returns
 * only the char code, so marked and unmarked text tokenise identically and a formatting-only edit
 * is invisible to the changeset.
 *
 * Marks and attrs are sorted so the token is order-independent.
 */
export const encodeCharacterWithMarks = (char: number, marks: readonly Mark[]): number | string => {
	if (marks.length === 0) {
		return char;
	}
	let markKey = markKeyCache.get(marks);
	if (markKey === undefined) {
		markKey = buildMarkKey(marks);
		markKeyCache.set(marks, markKey);
	}
	return `${char}${MARK_KEY_SEPARATOR}${markKey}`;
};

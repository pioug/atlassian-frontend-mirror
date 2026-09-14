import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Whitespace as the diff treats it, U+00A0 included: a non-breaking space separates words for every
 * consumer here, so it is not a character a change can be said to start on.
 *
 * A Set rather than a regex, to avoid both the `require-unicode-regexp` lint rule and the TS1501
 * error the `u` flag triggers under this package's declaration build target.
 */
const WHITESPACE_CHAR_SET = new Set([' ', '\t', '\n', '\r', '\f', '\v', '\u00a0']);

export const isWhitespaceChar = (char: string): boolean => WHITESPACE_CHAR_SET.has(char);

/**
 * Build a per-content-offset view of a textblock's characters.
 *
 * Returns an array whose length is `parent.content.size`. For every offset that lies inside a text
 * node, `chars[offset]` is the character at that offset; for every offset that lies inside (or on
 * the edge of) a non-text inline node — hardBreak, mention, emoji, date, … — the entry is `null`,
 * which acts as an *opaque single token*: it counts as one word and is never whitespace.
 *
 * Using doc positions to index `parent.textContent` is wrong because `textContent` strips non-text
 * inline nodes, so every such node shifts the lookup off by its size. This per-offset view restores
 * a 1:1 mapping between doc positions inside the textblock and the character (or "no character",
 * i.e. a hard word boundary) at that position.
 */
export const buildCharsByOffset = (parent: PMNode): Array<string | null> => {
	const chars: Array<string | null> = new Array(parent.content.size).fill(null);
	parent.content.forEach((child, offset) => {
		if (!child.isText) {
			return;
		}
		const text = child.text ?? '';
		for (let i = 0; i < text.length; i++) {
			chars[offset + i] = text[i];
		}
	});
	return chars;
};

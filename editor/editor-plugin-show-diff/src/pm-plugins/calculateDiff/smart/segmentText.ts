import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * A half-open offset span `[from, to)` measured in *content offsets* relative to the
 * start of a textblock (i.e. the same coordinate space as `buildCharsByOffset`).
 */
export type OffsetSpan = { from: number; to: number };

/**
 * Minimal local typing for `Intl.Segmenter`. The TS lib target configured for this
 * package does not include the `Intl.Segmenter` declarations, so we declare just the
 * surface we use and access it via a runtime-checked cast. Remove when the lib target is
 * bumped to include `es2022.intl`/`esnext.intl`.
 */
type SegmentData = { index: number; isWordLike?: boolean; segment: string };
type LocalSegmenter = { segment: (input: string) => Iterable<SegmentData> };
type LocalSegmenterCtor = new (
	locale: string,
	options: { granularity: 'sentence' | 'word' | 'grapheme' },
) => LocalSegmenter;

// A character is treated as part of a word unless it is whitespace or common punctuation.
// We deliberately avoid Unicode property escapes (`\p{...}`) and the `u` flag here: the `u`
// flag is only valid when targeting es6+, and the declaration-generation build config for
// this package targets an older lib, which rejects it with TS1501. This negated approach
// keeps word segmentation reasonable across scripts (any non-punctuation, non-space glyph
// counts as a word char) without needing Unicode-aware regex.
const NON_WORD_CHARS = ' \t\n\r\f\v.,;:!?…。！？、"\'`“”‘’()[]{}<>/\\|@#$%^&*-+=~';
const NON_WORD_CHAR_SET = new Set(NON_WORD_CHARS.split(''));
const isWordChar = (ch: string): boolean => !NON_WORD_CHAR_SET.has(ch);
// Whitespace is checked via a Set rather than a regex to avoid both the `require-unicode-regexp`
// lint rule and the TS1501 error the `u` flag triggers under this package's build lib target.
const WHITESPACE_CHAR_SET = new Set([' ', '\t', '\n', '\r', '\f', '\v', '\u00a0']);
const isWhitespaceChar = (ch: string): boolean => WHITESPACE_CHAR_SET.has(ch);
// Sentence terminators used by the regex fallback. We intentionally keep this small and
// conservative — the Intl.Segmenter path is the source of truth when available.
const SENTENCE_TERMINATORS = new Set(['.', '!', '?', '…', '。', '！', '？']);

/**
 * Build a per-content-offset view of a textblock's characters.
 *
 * `chars[i]` is the character at content offset `i`, or `null` when that offset lies
 * inside a non-text inline node (mention, date, emoji, hardBreak, …). A `null` acts as an
 * *opaque single token*: it counts as one word and never terminates a sentence.
 */
export const buildCharsByOffset = (parent: PMNode): Array<string | null> => {
	const chars: Array<string | null> = Array.from({ length: parent.content.size }, () => null);
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

const getSegmenterCtor = (): LocalSegmenterCtor | undefined => {
	if (typeof Intl === 'undefined') {
		return undefined;
	}
	const ctor = (Intl as unknown as { Segmenter?: unknown }).Segmenter;
	return typeof ctor === 'function' ? (ctor as LocalSegmenterCtor) : undefined;
};

let cachedLocale: string | undefined;
let cachedSentenceSegmenter: LocalSegmenter | undefined;
let cachedWordSegmenter: LocalSegmenter | undefined;

const getSegmenters = (
	locale: string,
): { sentence: LocalSegmenter; word: LocalSegmenter } | undefined => {
	const Ctor = getSegmenterCtor();
	if (!Ctor) {
		return undefined;
	}
	if (cachedLocale !== locale || !cachedSentenceSegmenter || !cachedWordSegmenter) {
		cachedLocale = locale;
		cachedSentenceSegmenter = new Ctor(locale, { granularity: 'sentence' });
		cachedWordSegmenter = new Ctor(locale, { granularity: 'word' });
	}
	return { sentence: cachedSentenceSegmenter, word: cachedWordSegmenter };
};

/**
 * Convert a char-view into a plain string plus an index map back to content offsets.
 *
 * Opaque inline tokens (`null`) are represented in the string by a single sentinel
 * character (Unicode Object Replacement Character, U+FFFC) so that:
 * - the segmenter treats them as a word-like glyph rather than whitespace/punctuation;
 * - they never look like a sentence terminator.
 * `indexMap[j]` gives the content offset of string index `j`.
 */
const OBJECT_REPLACEMENT = '\uFFFC';

const flattenChars = (chars: Array<string | null>): { indexMap: number[]; text: string } => {
	let text = '';
	const indexMap: number[] = [];
	for (let offset = 0; offset < chars.length; offset++) {
		const ch = chars[offset];
		text += ch === null ? OBJECT_REPLACEMENT : ch;
		indexMap.push(offset);
	}
	return { text, indexMap };
};

const stringIndexToOffset = (indexMap: number[], strIdx: number, fallback: number): number => {
	if (strIdx < 0) {
		return fallback;
	}
	if (strIdx >= indexMap.length) {
		// One-past-the-end maps to the offset after the last char.
		return indexMap.length > 0 ? indexMap[indexMap.length - 1] + 1 : fallback;
	}
	return indexMap[strIdx];
};

/**
 * Segment a textblock char-view into sentence spans (content-offset coordinates).
 * Uses Intl.Segmenter when available, otherwise a conservative regex fallback.
 */
export const segmentSentences = (chars: Array<string | null>, locale: string): OffsetSpan[] => {
	if (chars.length === 0) {
		return [];
	}
	const { text, indexMap } = flattenChars(chars);
	const segmenters = getSegmenters(locale);

	if (segmenters) {
		const spans: OffsetSpan[] = [];
		for (const seg of segmenters.sentence.segment(text)) {
			const startOffset = stringIndexToOffset(indexMap, seg.index, 0);
			const endOffset = stringIndexToOffset(indexMap, seg.index + seg.segment.length, chars.length);
			if (endOffset > startOffset) {
				spans.push({ from: startOffset, to: endOffset });
			}
		}
		return spans.length > 0 ? spans : [{ from: 0, to: chars.length }];
	}

	// Regex fallback: split after a sentence terminator followed by whitespace/EOL.
	// A `null` (OBJECT_REPLACEMENT) is never a terminator.
	const spans: OffsetSpan[] = [];
	let start = 0;
	for (let i = 0; i < chars.length; i++) {
		const ch = chars[i];
		if (ch !== null && SENTENCE_TERMINATORS.has(ch)) {
			// Consume trailing spaces as part of this sentence.
			let end = i + 1;
			while (end < chars.length && chars[end] !== null && isWhitespaceChar(chars[end] as string)) {
				end++;
			}
			spans.push({ from: start, to: end });
			start = end;
		}
	}
	if (start < chars.length) {
		spans.push({ from: start, to: chars.length });
	}
	return spans.length > 0 ? spans : [{ from: 0, to: chars.length }];
};

/**
 * Count word-like tokens within a content-offset range of the char-view.
 * Each opaque inline token (`null`) counts as exactly one word.
 */
export const countWords = (
	chars: Array<string | null>,
	span: OffsetSpan,
	locale: string,
): number => {
	const slice = chars.slice(span.from, span.to);
	if (slice.length === 0) {
		return 0;
	}
	const segmenters = getSegmenters(locale);
	const { text } = flattenChars(slice);

	if (segmenters) {
		let count = 0;
		for (const seg of segmenters.word.segment(text)) {
			// Object-replacement sentinel is word-like; count it.
			if (seg.isWordLike || seg.segment.includes(OBJECT_REPLACEMENT)) {
				count++;
			}
		}
		return count;
	}

	// Regex fallback: a run of word chars OR a single opaque token is one word.
	let count = 0;
	let inWord = false;
	for (const ch of slice) {
		if (ch === null) {
			count++;
			inWord = false;
			continue;
		}
		if (isWordChar(ch)) {
			if (!inWord) {
				count++;
				inWord = true;
			}
		} else {
			inWord = false;
		}
	}
	return count;
};

/**
 * Return the word-token spans (content-offset coordinates) within a range. Used to decide
 * which words a change overlaps. Each opaque inline token is its own span.
 */
export const segmentWordSpans = (
	chars: Array<string | null>,
	span: OffsetSpan,
	locale: string,
): OffsetSpan[] => {
	const segmenters = getSegmenters(locale);
	const slice = chars.slice(span.from, span.to);
	const { text, indexMap } = flattenChars(slice);
	const spans: OffsetSpan[] = [];

	if (segmenters) {
		for (const seg of segmenters.word.segment(text)) {
			if (seg.isWordLike || seg.segment.includes(OBJECT_REPLACEMENT)) {
				const from = span.from + stringIndexToOffset(indexMap, seg.index, 0);
				const to =
					span.from + stringIndexToOffset(indexMap, seg.index + seg.segment.length, slice.length);
				spans.push({ from, to });
			}
		}
		return spans;
	}

	let wordStart = -1;
	for (let i = 0; i < slice.length; i++) {
		const ch = slice[i];
		if (ch === null) {
			if (wordStart !== -1) {
				spans.push({ from: span.from + wordStart, to: span.from + i });
				wordStart = -1;
			}
			spans.push({ from: span.from + i, to: span.from + i + 1 });
		} else if (isWordChar(ch)) {
			if (wordStart === -1) {
				wordStart = i;
			}
		} else if (wordStart !== -1) {
			spans.push({ from: span.from + wordStart, to: span.from + i });
			wordStart = -1;
		}
	}
	if (wordStart !== -1) {
		spans.push({ from: span.from + wordStart, to: span.from + slice.length });
	}
	return spans;
};

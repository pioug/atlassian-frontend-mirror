import { fg } from '@atlaskit/platform-feature-flags';

const KEYCAP_COMBINING = 0x20e3;
const VARIATION_SELECTOR_16 = 0xfe0f;
const VARIATION_SELECTOR_15 = 0xfe0e;

// Text-presentation-default emoji: BMP characters (U+0000–U+FFFF) that are
// valid emoji but lack the Emoji_Presentation property render as text without
// U+FE0F. Supplementary-plane characters (U+10000+) always render as emoji
// regardless of the Emoji_Presentation property, so we skip those.
//
// This set is derived from Unicode 14.0 emoji-data.txt: all BMP code points
// that have the Emoji property but NOT the Emoji_Presentation property.
// Using an explicit lookup table avoids the \p{} Unicode property escape
// syntax (TS1501) which requires a specific TypeScript build target.
const TEXT_DEFAULT_EMOJI = new Set<number>([
	0x0023, 0x002a, 0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
	0x0038, 0x0039, 0x00a9, 0x00ae, 0x203c, 0x2049, 0x2122, 0x2139, 0x2194, 0x2195,
	0x2196, 0x2197, 0x2198, 0x2199, 0x21a9, 0x21aa, 0x2328, 0x23cf, 0x23ed, 0x23ee,
	0x23ef, 0x23f1, 0x23f2, 0x23f8, 0x23f9, 0x23fa, 0x24c2, 0x25aa, 0x25ab, 0x25b6,
	0x25c0, 0x25fb, 0x25fc, 0x2600, 0x2601, 0x2602, 0x2603, 0x2604, 0x260e, 0x2611,
	0x2618, 0x261d, 0x2620, 0x2622, 0x2623, 0x2626, 0x262a, 0x262e, 0x262f, 0x2638,
	0x2639, 0x263a, 0x2640, 0x2642, 0x265f, 0x2660, 0x2663, 0x2665, 0x2666, 0x2668,
	0x267b, 0x267e, 0x2692, 0x2694, 0x2695, 0x2696, 0x2697, 0x2699, 0x269b, 0x269c,
	0x26a0, 0x26a7, 0x26b0, 0x26b1, 0x26c8, 0x26cf, 0x26d1, 0x26d3, 0x26e9, 0x26f0,
	0x26f1, 0x26f4, 0x26f7, 0x26f8, 0x26f9, 0x2702, 0x2708, 0x2709, 0x270c, 0x270d,
	0x270f, 0x2712, 0x2714, 0x2716, 0x271d, 0x2721, 0x2733, 0x2734, 0x2744, 0x2747,
	0x2763, 0x2764, 0x27a1, 0x2934, 0x2935, 0x2b05, 0x2b06, 0x2b07, 0x3030, 0x303d,
	0x3297, 0x3299,
]);

/**
 * Converts an emoji ID (a hyphen-separated string of hex Unicode code points,
 * e.g. `"1f44d"`, `"1f44d-1f3fb"`, `"1f468-200d-1f469-200d-1f467"`) into its
 * corresponding Unicode string.
 *
 * Special handling:
 * - Keycap sequences: U+20E3 (COMBINING ENCLOSING KEYCAP) must be preceded by
 *   U+FE0F (VARIATION SELECTOR-16) to form a well-defined keycap emoji.
 * - Text-default emoji (characters whose default presentation is text) must be
 *   followed by U+FE0F to force emoji presentation.
 *
 * @returns The Unicode string for the emoji, or `undefined` if the input is
 *   invalid (empty string, non-hex segments, or out-of-range code points).
 */
export function emojiIdToEmoji(id: string): string | undefined {
	if (!id) {
		return undefined;
	}

	const segments = id.split('-');
	const codePoints: number[] = [];

	for (const segment of segments) {
		if (!/^[0-9a-fA-F]+$/.test(segment)) {
			return undefined;
		}
		const cp = parseInt(segment, 16);
		// Valid Unicode scalar values: 0x0000–0x10FFFF, excluding surrogates 0xD800–0xDFFF
		if (isNaN(cp) || cp < 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) {
			return undefined;
		}
		codePoints.push(cp);
	}

	if (codePoints.length === 0) {
		return undefined;
	}

	const processedCodePoints: number[] = [];
	for (let i = 0; i < codePoints.length; i++) {
		const cp = codePoints[i];
		const next = codePoints[i + 1];

		processedCodePoints.push(cp);

		// Insert U+FE0F before U+20E3 if not already present.
		// Keycap sequences: digit/# /* followed by U+20E3 need U+FE0F between them.
		if (next === KEYCAP_COMBINING && cp !== VARIATION_SELECTOR_16) {
			processedCodePoints.push(VARIATION_SELECTOR_16);
		}
	}

	// Text-presentation-default emoji: characters that are valid emoji but whose
	// default rendering is text (e.g. ☪ ☺ ☢ etc.) must be followed by
	// U+FE0F (VARIATION SELECTOR-16) to force emoji presentation.
	if (fg('platform_twemoji_removal_unicode_emojis')) {
		const lastCodePoint = processedCodePoints[processedCodePoints.length - 1];
		const alreadyHasVariationSelector =
			lastCodePoint === VARIATION_SELECTOR_16 ||
			lastCodePoint === VARIATION_SELECTOR_15 ||
			// Keycap sequences end with U+20E3 — they already have U+FE0F inserted inline
			// and must not have another variation selector appended at the end.
			lastCodePoint === KEYCAP_COMBINING;

		if (!alreadyHasVariationSelector) {
			const baseCodePoint = codePoints[0];
			if (codePoints.length === 1 && baseCodePoint <= 0xffff && TEXT_DEFAULT_EMOJI.has(baseCodePoint)) {
				processedCodePoints.push(VARIATION_SELECTOR_16);
			}
		}
	}

	try {
		return String.fromCodePoint(...processedCodePoints);
	} catch {
		return undefined;
	}
}

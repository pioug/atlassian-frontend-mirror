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

	// Keycap sequences: digit/# /* followed by U+20E3 need U+FE0F between them.
	// The keycap base characters are: 0x23 (#), 0x2A (*), 0x30–0x39 (0–9).
	const KEYCAP_COMBINING = 0x20e3;
	const VARIATION_SELECTOR_16 = 0xfe0f;

	const processedCodePoints: number[] = [];
	for (let i = 0; i < codePoints.length; i++) {
		const cp = codePoints[i];
		const next = codePoints[i + 1];

		processedCodePoints.push(cp);

		// Insert U+FE0F before U+20E3 if not already present
		if (next === KEYCAP_COMBINING && cp !== VARIATION_SELECTOR_16) {
			processedCodePoints.push(VARIATION_SELECTOR_16);
		}
	}

	try {
		return String.fromCodePoint(...processedCodePoints);
	} catch {
		return undefined;
	}
}

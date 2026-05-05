import { emojiIdToEmoji } from '../../../util/emojiIdToEmoji';

describe('emojiIdToEmoji', () => {
	describe('valid single codepoints', () => {
		it('converts a simple single codepoint emoji id', () => {
			// 👍 THUMBS UP SIGN (U+1F44D)
			expect(emojiIdToEmoji('1f44d')).toBe('👍');
		});

		it('converts a basic ASCII-range codepoint', () => {
			// 😀 GRINNING FACE (U+1F600)
			expect(emojiIdToEmoji('1f600')).toBe('😀');
		});

		it('is case-insensitive for hex digits', () => {
			expect(emojiIdToEmoji('1F44D')).toBe('👍');
			expect(emojiIdToEmoji('1F44d')).toBe('👍');
		});
	});

	describe('ZWJ sequences', () => {
		it('converts a ZWJ family sequence', () => {
			// 👨‍👩‍👧 FAMILY: MAN, WOMAN, GIRL
			const result = emojiIdToEmoji('1f468-200d-1f469-200d-1f467');
			expect(result).toBe('👨\u200D👩\u200D👧');
		});
	});

	describe('skin tone modifier sequences', () => {
		it('converts an emoji with skin tone modifier', () => {
			// 👍🏻 THUMBS UP with light skin tone
			expect(emojiIdToEmoji('1f44d-1f3fb')).toBe('👍🏻');
		});

		it('converts an emoji with dark skin tone modifier', () => {
			// 👍🏿 THUMBS UP with dark skin tone
			expect(emojiIdToEmoji('1f44d-1f3ff')).toBe('👍🏿');
		});
	});

	describe('flag sequences (regional indicators)', () => {
		it('converts a regional indicator pair for a country flag', () => {
			// 🇦🇺 FLAG: AUSTRALIA
			expect(emojiIdToEmoji('1f1e6-1f1fa')).toBe('🇦🇺');
		});
	});

	describe('keycap sequences', () => {
		it('inserts U+FE0F before U+20E3 for digit keycap', () => {
			// 0️⃣ KEYCAP DIGIT ZERO
			const result = emojiIdToEmoji('30-20e3');
			// Should contain digit '0' (U+0030), then U+FE0F, then U+20E3
			expect(result).toBe('0\uFE0F\u20E3');
		});

		it('inserts U+FE0F before U+20E3 for # keycap', () => {
			// #️⃣ KEYCAP NUMBER SIGN
			const result = emojiIdToEmoji('23-20e3');
			expect(result).toBe('#\uFE0F\u20E3');
		});

		it('does not double-insert U+FE0F when already present', () => {
			// If the source already includes fe0f before 20e3
			const result = emojiIdToEmoji('30-fe0f-20e3');
			expect(result).toBe('0\uFE0F\u20E3');
		});
	});

	describe('variation selectors', () => {
		it('preserves variation selector-16 when already in sequence', () => {
			// ☪️ STAR AND CRESCENT with emoji presentation
			const result = emojiIdToEmoji('262a-fe0f');
			expect(result).toBe('☪️');
		});
	});

	describe('invalid inputs', () => {
		it('returns undefined for empty string', () => {
			expect(emojiIdToEmoji('')).toBeUndefined();
		});

		it('returns undefined for non-hex segments', () => {
			expect(emojiIdToEmoji('xyz')).toBeUndefined();
			expect(emojiIdToEmoji('1f44d-xyz')).toBeUndefined();
		});

		it('returns undefined for out-of-range code points', () => {
			// U+110000 is one beyond the max valid Unicode scalar value (U+10FFFF)
			expect(emojiIdToEmoji('110000')).toBeUndefined();
		});

		it('returns undefined for surrogate code points', () => {
			// U+D800 is a high surrogate — not a valid scalar value
			expect(emojiIdToEmoji('d800')).toBeUndefined();
		});
	});
});

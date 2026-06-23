import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import { emojiIdToEmoji } from '../../../util/emojiIdToEmoji';

describe('emojiIdToEmoji', () => {
	beforeEach(() => {
		setupEditorExperiments('test', {
			platform_use_unicode_emojis: true,
		});
	});

	it('returns undefined when the unicode emoji experiment is disabled', () => {
		setupEditorExperiments('test', {
			platform_use_unicode_emojis: false,
		});

		expect(emojiIdToEmoji('1f600')).toBeUndefined();
	});

	describe('valid single codepoints', () => {
		it('converts a simple single codepoint emoji id', () => {
			// 👍 THUMBS UP SIGN (U+1F44D)
			expect(emojiIdToEmoji('1f44d')).toBe('👍️');
		});

		it('converts a basic ASCII-range codepoint', () => {
			// 😀 GRINNING FACE (U+1F600)
			expect(emojiIdToEmoji('1f600')).toBe('😀');
		});

		it('is case-insensitive for hex digits', () => {
			expect(emojiIdToEmoji('1F44D')).toBe('👍️');
			expect(emojiIdToEmoji('1F44d')).toBe('👍️');
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
		it('returns undefined for country flags so callers use Twemoji', () => {
			expect(emojiIdToEmoji('1f1e6-1f1fa')).toBeUndefined();
		});

		it('returns undefined for flag base and ZWJ emoji so callers use Twemoji', () => {
			expect(emojiIdToEmoji('1f3f3')).toBeUndefined();
			expect(emojiIdToEmoji('1f3f3-200d-1f308')).toBeUndefined();
			expect(emojiIdToEmoji('1f3f4-e0067-e0062-e0065-e006e-e0067-e007f')).toBeUndefined();
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

		it('adds variation selector-16 for BMP emoji variation bases', () => {
			expect(emojiIdToEmoji('262a')).toBe('☪️');
		});

		it('adds variation selector-16 for supplementary-plane emoji variation bases', () => {
			expect(emojiIdToEmoji('1f37d')).toBe('🍽️');
			expect(emojiIdToEmoji('1f396')).toBe('🎖️');
			expect(emojiIdToEmoji('1f39b')).toBe('🎛️');
			expect(emojiIdToEmoji('1f3d5')).toBe('🏕️');
			expect(emojiIdToEmoji('1f5b2')).toBe('🖲️');
			expect(emojiIdToEmoji('1f5e1')).toBe('🗡️');
			expect(emojiIdToEmoji('1f5f3')).toBe('🗳️');
		});

		it('adds variation selector-16 for supplementary-plane emoji-default variation bases', () => {
			expect(emojiIdToEmoji('1f44d')).toBe('👍️');
		});

		it('does not double-insert variation selector-16 for supplementary-plane emoji', () => {
			expect(emojiIdToEmoji('1f37d-fe0f')).toBe('🍽️');
		});

		it('adds variation selector-16 before ZWJ when a non-flag emoji variation base starts a sequence', () => {
			expect(emojiIdToEmoji('1f441-200d-1f5e8')).toBe('👁️‍🗨️');
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

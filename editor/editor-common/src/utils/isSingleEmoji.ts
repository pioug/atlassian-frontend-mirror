const SINGLE_EMOJI_REGEX =
	// Regular expression to match a single emoji character
	/^(\p{Emoji_Presentation}(?:[\u{1F3FB}-\u{1F3FF}])?|\p{Extended_Pictographic}\u{FE0F}(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}\p{Extended_Pictographic}\u{FE0F}?(?:[\u{1F3FB}-\u{1F3FF}])?)*|\p{Extended_Pictographic}\u{FE0F}?(?:[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}\p{Extended_Pictographic}\u{FE0F}?(?:[\u{1F3FB}-\u{1F3FF}])?)+|\p{Regional_Indicator}\p{Regional_Indicator})$/u;

/**
 * Check if we can nicely fallback to the nodes text
 *
 * @param fallbackText string of the nodes fallback text
 *
 * @example
 * isSingleEmoji('😀') // true
 */
export function isSingleEmoji(fallbackText: string | undefined): boolean {
	return SINGLE_EMOJI_REGEX.test(fallbackText ?? '');
}

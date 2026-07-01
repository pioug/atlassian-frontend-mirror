/**
 * Pure utilities for the "Create an emoji with Rovo" (AI emoji generation) flow.
 */

/**
 * Maximum length of an auto-generated shortname. Matches the `maxNameLength`
 * used by the manual emoji upload flow (see EmojiUploadPicker).
 */
export const MAX_SHORTNAME_LENGTH = 50;

const LEADING_ARTICLES = ['a', 'an', 'the'];

/**
 * Convert a free-text emoji description into a slugified shortname suitable for
 * the `:shortname:` field expected by pf-emoji-service.
 *
 * Rules (v1):
 * - Strip leading articles (a, an, the)
 * - Lowercase
 * - Replace runs of whitespace with a single underscore
 * - Remove any character that is not a-z, 0-9 or underscore
 * - Collapse repeated underscores and trim leading/trailing underscores
 * - Truncate to {@link MAX_SHORTNAME_LENGTH} characters
 *
 * @example
 * slugifyPrompt('a cat wearing a hard hat') // => 'cat_wearing_a_hard_hat'
 */
export const slugifyPrompt = (prompt: string): string => {
	if (!prompt) {
		return '';
	}

	let words = prompt.trim().toLowerCase().split(/\s+/);

	// Strip a single leading article only (e.g. "a cat" -> "cat").
	if (words.length > 1 && LEADING_ARTICLES.includes(words[0])) {
		words = words.slice(1);
	}

	const slug = words
		.join('_')
		// remove everything that is not a word char (letters, digits, underscore)
		.replace(/[^a-z0-9_]/g, '')
		// collapse repeated underscores introduced by removed characters
		.replace(/_+/g, '_')
		// trim leading/trailing underscores
		.replace(/^_+|_+$/g, '');

	return slug.slice(0, MAX_SHORTNAME_LENGTH);
};

/**
 * Prefix prepended to the user's description so the header-image backend
 * produces clean, emoji-style output instead of a scene/photo.
 *
 * Kept as a single line (no newlines) — newlines in the prompt can degrade the
 * model's output. Learnings from ShipIt 56 ("Emoji Pop") showed that a simple
 * prompt prefix significantly improved emoji quality.
 */
export const EMOJI_PROMPT_PREFIX = 'Generate a clean, simple, emoji-style icon of ';

/**
 * Wrap the raw user prompt with the emoji-style prefix.
 *
 * @example
 * wrapEmojiPrompt('a cat wearing a hard hat')
 * // => 'Generate a clean, simple, emoji-style icon of a cat wearing a hard hat'
 */
export const wrapEmojiPrompt = (userPrompt: string): string =>
	`${EMOJI_PROMPT_PREFIX}${userPrompt.trim()}`;

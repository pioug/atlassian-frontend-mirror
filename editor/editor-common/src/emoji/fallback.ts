import { isSingleEmoji } from '../utils/isSingleEmoji';

/** Shared custom-emoji fallback without importing components or resolving providers. */
export function getEmojiCustomFallback(fallbackText: string | undefined): '\uFFFD' | undefined {
	return isSingleEmoji(fallbackText) ? undefined : '\uFFFD';
}

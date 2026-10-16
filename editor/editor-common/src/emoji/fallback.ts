import { fg } from '@atlaskit/platform-feature-flags/fg';

import { isSingleEmoji } from '../utils/isSingleEmoji';

/** Shared custom-emoji fallback without importing components or resolving providers. */
export function getEmojiCustomFallback(fallbackText: string | undefined): '\uFFFD' | undefined {
	if (fg('platform_editor_custom_emoji_unicode_fallback')) {
		return isSingleEmoji(fallbackText) ? undefined : '\uFFFD';
	}
	return undefined;
}

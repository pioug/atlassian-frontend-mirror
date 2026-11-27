import { snapshot } from '@af/visual-regression';

import {
	EmojiDeletePreview,
	EmojiUploadPickerWithoutName,
	EmojiUploadPickerWithName,
} from './common.fixture.vr.ap';

snapshot(EmojiDeletePreview, {
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
});
snapshot(EmojiUploadPickerWithoutName, {
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
});
snapshot(EmojiUploadPickerWithName, {
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
});

import { snapshot } from '@af/visual-regression';

import {
	OriginalEmojiPickerFooters,
	SpacedEmojiPickerFooters,
} from './picker-footer.fixture.vr.ap';

snapshot(SpacedEmojiPickerFooters, {
	description: 'Emoji picker footer uses shared spacing with email search enabled',
	featureFlags: {
		platform_editor_mentions_email_search: true,
		platform_teamoji_26_refresh_emoji_picker_user_id: false,
		platform_bitbucket_fix_shortname_and_ordering: false,
	},
});

snapshot(OriginalEmojiPickerFooters, {
	description: 'Emoji picker footer preserves spacing with email search disabled',
	featureFlags: {
		platform_editor_mentions_email_search: false,
		platform_teamoji_26_refresh_emoji_picker_user_id: false,
		platform_bitbucket_fix_shortname_and_ordering: false,
	},
});

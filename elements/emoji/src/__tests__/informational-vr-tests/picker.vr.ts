import { snapshotInformational } from '@af/visual-regression';

import { EmojiPickerWithUpload } from './picker.fixture';

const featureFlags = {
	platform_editor_css_migrate_emoji: [true, false],
};

snapshotInformational(EmojiPickerWithUpload, {
	description: 'Emoji picker with preview',
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	featureFlags,
	prepare: async (page) => {
		await page.getByTestId('sprite-emoji-:grinning:').hover();
	},
});

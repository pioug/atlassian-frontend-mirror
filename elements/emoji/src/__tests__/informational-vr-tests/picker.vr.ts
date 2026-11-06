import { snapshotInformational } from '@af/visual-regression';

import { EmojiPickerWithUpload } from './picker.fixture.vr.ap';

snapshotInformational(EmojiPickerWithUpload, {
	description: 'Emoji picker with preview',
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	prepare: async (page) => {
		await page.getByTestId('sprite-emoji-:grinning:').hover();
		await page.getByRole('searchbox', { name: 'Search emoji by name' }).focus();
	},
});

import { snapshotInformational } from '@af/visual-regression';
import { setupEditorExperiments } from '@atlaskit/tmp-editor-statsig/setup';

import { EmojiPickerWithUpload } from './picker.fixture';

setupEditorExperiments('test', {
	platform_teamoji_26_refresh_emoji_picker: false,
});

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
	},
});

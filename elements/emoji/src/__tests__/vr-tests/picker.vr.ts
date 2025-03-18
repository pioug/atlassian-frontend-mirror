import { snapshot } from '@af/visual-regression';

import {
	EmojiPickerWithUpload,
	EmojiPickerWithoutUpload,
	EmojiPickerWithFallbackWithUpload,
	EmojiPickerWithFallbackWithoutUpload,
} from './picker.fixture';

const featureFlags = {
	platform_editor_css_migrate_emoji: [true, false],
};

snapshot(EmojiPickerWithUpload, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	featureFlags,
});
snapshot(EmojiPickerWithoutUpload, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	featureFlags,
});
snapshot(EmojiPickerWithFallbackWithUpload, {
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'Expected since fallback only renders if src is unavailable',
			jiraIssueId: 'TODO-123',
		},
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	featureFlags: {
		...featureFlags,
		platform_editor_preload_emoji_picker: true,
	},
});
snapshot(EmojiPickerWithFallbackWithoutUpload, {
	ignoredErrors: [
		{
			pattern: /Failed to load resource/,
			ignoredBecause: 'Expected since fallback only renders if src is unavailable',
			jiraIssueId: 'TODO-123',
		},
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
	featureFlags: {
		...featureFlags,
		platform_editor_preload_emoji_picker: true,
	},
});

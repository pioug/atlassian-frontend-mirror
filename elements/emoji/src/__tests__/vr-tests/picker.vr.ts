import { snapshot } from '@af/visual-regression';

import {
	EmojiPickerWithUpload,
	EmojiPickerWithoutUpload,
	EmojiPickerWithFallbackWithUpload,
	EmojiPickerWithFallbackWithoutUpload,
} from './picker.fixture';

snapshot(EmojiPickerWithUpload, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
});
snapshot(EmojiPickerWithoutUpload, {
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
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
});

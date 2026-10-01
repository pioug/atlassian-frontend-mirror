import { snapshot } from '@af/visual-regression';

import {
	EmojiPickerWithUpload,
	EmojiPickerWithoutUpload,
	EmojiPickerWithFallbackWithUpload,
	EmojiPickerWithFallbackWithoutUpload,
} from './picker.fixture.vr.ap';

snapshot(EmojiPickerWithUpload, {
	states: [
		{ selector: { byRole: 'searchbox', options: { name: 'Emoji name' } }, state: 'focused' },
	],
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
});
snapshot(EmojiPickerWithoutUpload, {
	states: [
		{ selector: { byRole: 'searchbox', options: { name: 'Emoji name' } }, state: 'focused' },
	],
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'React 18 causes a warning to occur',
			jiraIssueId: 'TODO-123',
		},
	],
});
snapshot(EmojiPickerWithFallbackWithUpload, {
	states: [
		{ selector: { byRole: 'searchbox', options: { name: 'Emoji name' } }, state: 'focused' },
	],
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
	states: [
		{ selector: { byRole: 'searchbox', options: { name: 'Emoji name' } }, state: 'focused' },
	],
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

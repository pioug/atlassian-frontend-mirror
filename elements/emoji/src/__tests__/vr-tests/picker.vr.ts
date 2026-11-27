import { snapshot } from '@af/visual-regression';

import {
	EmojiPickerWithUpload,
	EmojiPickerWithoutUpload,
	EmojiPickerWithFallbackWithUpload,
	EmojiPickerWithFallbackWithoutUpload,
} from './picker.fixture.vr.ap';

snapshot(EmojiPickerWithUpload, {
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
	states: [
		{
			selector: { byRole: 'searchbox', options: { name: 'Search emoji by name' } },
			state: 'focused',
		},
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
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
	states: [
		{
			selector: { byRole: 'searchbox', options: { name: 'Search emoji by name' } },
			state: 'focused',
		},
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
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
	states: [
		{
			selector: { byRole: 'searchbox', options: { name: 'Search emoji by name' } },
			state: 'focused',
		},
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
	featureFlags: {
		platform_emoji_search_top: [true, false],
		platform_ally_emoji_fixes_various: true,
	},
	states: [
		{
			selector: { byRole: 'searchbox', options: { name: 'Search emoji by name' } },
			state: 'focused',
		},
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

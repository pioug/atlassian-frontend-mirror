import { snapshot } from '@af/visual-regression';

import {
	IconTypeAttachment,
	IconTypeCheckItem,
	IconTypeComment,
	IconTypePriorityBlocker,
	IconTypePriorityCritical,
	IconTypePriorityHigh,
	IconTypePriorityHighest,
	IconTypePriorityLow,
	IconTypePriorityLowest,
	IconTypePriorityMajor,
	IconTypePriorityMedium,
	IconTypePriorityMinor,
	IconTypePriorityTrivial,
	IconTypePriorityUndefined,
	IconTypeProgrammingLanguage,
	IconTypeReact,
	IconTypeSubscriber,
	IconTypeSubTasksProgress,
	IconTypeView,
	IconTypeVote,
} from '../../../examples/vr-flexible-card/vr-flexible-ui-icon';

snapshot(IconTypeAttachment, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypeCheckItem, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeComment, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeView, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeReact, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeVote, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityBlocker, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityCritical, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityHigh, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityHighest, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityLow, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityLowest, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityMajor, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityMedium, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityMinor, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityTrivial, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityUndefined, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeProgrammingLanguage, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeSubscriber, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

snapshot(IconTypeSubTasksProgress, {
	featureFlags: {
		'platform-visual-refresh-icons': true,
	},
	ignoredErrors: [
		{
			pattern: /Can't perform a React state update on a component that hasn't mounted yet/,
			ignoredBecause: 'react-loadable causing uncaught error to be thrown',
			jiraIssueId: 'NAVX-3277',
		},
	],
	waitForReactLazy: true,
});

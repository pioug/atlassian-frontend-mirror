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
	},
	waitForReactLazy: true,
});

snapshot(IconTypeCheckItem, {
	featureFlags: {
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
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityBlocker, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityCritical, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityHigh, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityHighest, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityLow, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityLowest, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityMajor, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityMedium, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityMinor, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityTrivial, {
	featureFlags: {
	},
	waitForReactLazy: true,
});

snapshot(IconTypePriorityUndefined, {
	featureFlags: {
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

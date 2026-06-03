/**
 * Structured MCP docs for `@atlaskit/analytics-next`.
 *
 * ⚠️ Pilot / not yet final. This file is part of the libraries-content pilot
 * for the "Libraries, hooks, utilities in structured content" RFC. The
 * container schema and per-kind shapes are still in review — expect breaking
 * changes before this is rolled out broadly. Do not depend on the format yet.
 *
 * This is the canonical mixed-kind example: the package exports React
 * components (`AnalyticsListener`), hooks (`useAnalyticsEvents`), and utility
 * functions (`createAndFireEvent`). Each kind lands in the matching top-level
 * key of the container schema.
 *
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/analytics-next',
		packagePath,
		packageJson,
		overview:
			'React components, hooks, and helpers for instrumenting user activity. Wrap your app in an `AnalyticsListener` to subscribe to events on a channel, fire events from your components with `useAnalyticsEvents`, and decorate child events with `AnalyticsContext`.',
	},
	components: [
		{
			name: 'AnalyticsListener',
			description:
				'Subscribes to analytics events fired on a given channel from anywhere in its subtree. Mount once near the app root per channel you want to listen on.',
			status: 'general-availability',
			import: {
				name: 'AnalyticsListener',
				package: '@atlaskit/analytics-next',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Mount one listener per channel near the app root. Use `channel="*"` to listen to every channel.',
				'Forward received events to your downstream analytics SDK (Segment, GASv3, etc.) inside `onEvent`.',
			],
			keywords: ['analytics', 'listener', 'events', 'analytics-next'],
			categories: ['analytics'],
			examples: [
				{
					name: 'Basic listener',
					description: 'Subscribe to an entire app and log events.',
					source: path.resolve(packagePath, './examples/10-basic-create-and-fire.tsx'),
				},
			],
		},
		{
			name: 'AnalyticsContext',
			description:
				'Decorates every analytics event fired in its subtree with extra context data (e.g. the current page or feature area).',
			status: 'general-availability',
			import: {
				name: 'AnalyticsContext',
				package: '@atlaskit/analytics-next',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Nest `AnalyticsContext` providers — context from each one is appended in order, so the closest provider is last in the resulting array.',
			],
			keywords: ['analytics', 'context', 'analytics-next'],
			categories: ['analytics'],
			examples: [
				{
					name: 'Adding context',
					description: 'Attach feature area context to all child events.',
					source: path.resolve(packagePath, './examples/20-adding-analytics-context.tsx'),
				},
			],
		},
		{
			name: 'AnalyticsErrorBoundary',
			description:
				'Error boundary that fires an analytics event when a render error is caught, then optionally renders a fallback UI.',
			status: 'general-availability',
			import: {
				name: 'AnalyticsErrorBoundary',
				package: '@atlaskit/analytics-next',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Wrap experiences whose render failures you want to instrument. Provide `ErrorComponent` for a graceful fallback.',
			],
			keywords: ['analytics', 'error-boundary', 'analytics-next'],
			categories: ['analytics', 'error-handling'],
			examples: [
				{
					name: 'Error boundary with fallback',
					description: 'Render a fallback component and fire an analytics event when a child throws.',
					source: path.resolve(packagePath, './examples/11-error-boundary-with-error-component.tsx'),
				},
			],
		},
	],
	hooks: [
		{
			name: 'useAnalyticsEvents',
			description:
				'Returns `createAnalyticsEvent`, a stable callback that produces a `UIAnalyticsEvent` pre-wired with the surrounding analytics context and handlers. Call `.fire(channel)` on the returned event to dispatch it.',
			status: 'general-availability',
			parameters: [],
			returns: {
				type: '{ createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent }',
				description:
					'`createAnalyticsEvent` is referentially stable per nearest `AnalyticsContext`, so it is safe to put in dependency arrays.',
			},
			usageGuidelines: [
				'Use inside any component that needs to fire events. Always pair with a parent `AnalyticsListener`, otherwise events fire into the void.',
				'Build the payload with the smallest information the listener needs — heavy serialisation belongs in the handler, not the call site.',
			],
			keywords: ['analytics', 'hook', 'useAnalyticsEvents', 'analytics-next'],
			categories: ['analytics', 'hooks'],
			examples: [
				{
					name: 'Fire on click',
					description: 'Create and fire a click event from a button handler.',
					source: path.resolve(packagePath, './examples/10-basic-create-and-fire.tsx'),
				},
			],
		},
	],
	utilities: [
		{
			kind: 'function',
			name: 'createAndFireEvent',
			description:
				'Curried helper that builds a `UIAnalyticsEvent` for a payload and fires it on a channel in one go. The original event is also returned so the call site can keep working with it.',
			status: 'general-availability',
			signature:
				'(channel?: string) => (payload: AnalyticsEventPayload) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent',
			parameters: [
				{ name: 'channel', type: 'string', description: 'Optional channel to fire on.', isOptional: true },
				{ name: 'payload', type: 'AnalyticsEventPayload' },
				{
					name: 'createAnalyticsEvent',
					type: 'CreateUIAnalyticsEvent',
					description: 'The factory from `useAnalyticsEvents()` or `withAnalyticsEvents`.',
				},
			],
			returns: {
				type: 'UIAnalyticsEvent',
				description: 'The original (un-cloned) consumer event so callers can attach further context.',
			},
			usageGuidelines: [
				'Reach for `createAndFireEvent` when you want a one-liner inside an event handler. For more complex flows, build and fire the event explicitly.',
			],
			keywords: ['analytics', 'utility', 'createAndFireEvent', 'analytics-next'],
			categories: ['analytics', 'utilities'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'isUIAnalyticsEvent',
			description:
				'Type-guard that returns true if the given value is a `UIAnalyticsEvent` (including instances from older copies of `analytics-next`).',
			status: 'general-availability',
			signature: '(obj: unknown) => obj is UIAnalyticsEvent',
			parameters: [{ name: 'obj', type: 'unknown' }],
			returns: { type: 'boolean' },
			usageGuidelines: [
				'Use in listener handlers when you receive events from third-party code and need to narrow before reading `.payload`.',
			],
			keywords: ['analytics', 'guard', 'isUIAnalyticsEvent', 'analytics-next'],
			categories: ['analytics', 'utilities'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'UIAnalyticsEventHandler',
			description:
				'Signature for any function that receives events from an `AnalyticsListener`. Implement to forward events to your analytics SDK.',
			status: 'general-availability',
			definition: '(event: UIAnalyticsEvent, channel?: string) => void',
			usageGuidelines: [
				'Handlers must not throw — analytics must never crash product UI. The runtime swallows handler errors in production and logs them in development.',
			],
			keywords: ['analytics', 'type', 'handler', 'UIAnalyticsEventHandler', 'analytics-next'],
			categories: ['analytics', 'types'],
			examples: [],
		},
	],
};

export default documentation;

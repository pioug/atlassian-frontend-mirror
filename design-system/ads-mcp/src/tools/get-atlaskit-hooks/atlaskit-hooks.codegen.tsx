/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content hooks from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::8622cd207ede8e8e02275cd9e0dfc3cc>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen
 */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import type { HookMcpPayload } from './types';

export const atlaskitHooks: HookMcpPayload[] = [
	{
		name: 'useAnalyticsEvents',
		description:
			'Returns `createAnalyticsEvent`, a stable callback that produces a `UIAnalyticsEvent` pre-wired with the surrounding analytics context and handlers. Call `.fire(channel)` on the returned event to dispatch it.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside any component that needs to fire events. Always pair with a parent `AnalyticsListener`, otherwise events fire into the void.',
			'Build the payload with the smallest information the listener needs — heavy serialisation belongs in the handler, not the call site.',
		],
		keywords: ['analytics', 'hook', 'useAnalyticsEvents', 'analytics-next'],
		category: 'analytics',
		parameters: [],
		returns: {
			type: '{ createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent }',
			description:
				'`createAnalyticsEvent` is referentially stable per nearest `AnalyticsContext`, so it is safe to put in dependency arrays.',
		},
		package: '@atlaskit/analytics-next',
		examples: [
			"import React, { type FC, type MouseEvent, useCallback } from 'react';\nimport AnalyticsListener from '../src/components/AnalyticsListener';\nimport type UIAnalyticsEvent from '../src/events/UIAnalyticsEvent';\nimport { useAnalyticsEvents } from '../src/hooks/useAnalyticsEvents';\nimport { useCallbackWithAnalytics } from '../src/hooks/useCallbackWithAnalytics';\nimport { usePlatformLeafEventHandler } from '../src/hooks/usePlatformLeafEventHandler';\nimport withAnalyticsEvents, {\n\ttype WithAnalyticsEventsProps,\n} from '../src/hocs/withAnalyticsEvents';\ninterface Props extends WithAnalyticsEventsProps {\n\tchildren: React.ReactNode;\n\tonClick: (e: MouseEvent<HTMLButtonElement>) => void;\n}\nconst ButtonBase = ({ createAnalyticsEvent, onClick, ...rest }: Props) => {\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent!({\n\t\t\t\taction: 'click',\n\t\t\t});\n\t\t\t// Fire our analytics event on the 'atlaskit' channel\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...rest} onClick={handleClick} />;\n};\nconst Button = withAnalyticsEvents()(ButtonBase);\nconst ButtonUsingHook: FC<Props> = ({ onClick, ...props }) => {\n\t// Decompose function from the hook\n\tconst { createAnalyticsEvent } = useAnalyticsEvents();\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent({ action: 'click' });\n\t\t\t// Fire our analytics event\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingCallback: FC<Props> = ({ onClick, ...props }) => {\n\tconst handleClick = useCallbackWithAnalytics(onClick, { action: 'click' }, 'atlaskit');\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingEventHandlerHook = ({\n\tonClick,\n\tchildren,\n}: {\n\tchildren: React.ReactNode;\n\tonClick: (\n\t\tmouseEvent: React.MouseEvent<HTMLButtonElement>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => void;\n}) => {\n\tconst handleClick = usePlatformLeafEventHandler({\n\t\tfn: onClick,\n\t\taction: 'clicked',\n\t\tcomponentName: 'fancy-button',\n\t\tpackageName: '@atlaskit/fancy-button',\n\t\tpackageVersion: '0.1.0',\n\t});\n\treturn <button onClick={handleClick}>{children}</button>;\n};\nconst App: FC = () => {\n\tconst handleEvent = (analyticsEvent: UIAnalyticsEvent) => {\n\t\tconst { payload, context } = analyticsEvent;\n\t\tconsole.log('Received event:', { payload, context });\n\t};\n\tconst onClickHandler = () => console.log('onClickCallback');\n\treturn (\n\t\t<AnalyticsListener channel=\"atlaskit\" onEvent={handleEvent}>\n\t\t\t<Button onClick={onClickHandler}>Click me (withAnalyticsEvents)</Button>\n\t\t\t<br />\n\t\t\t<ButtonUsingHook onClick={onClickHandler}>Click me (useAnalyticsEvents)</ButtonUsingHook>\n\t\t\t<br />\n\t\t\t<ButtonUsingCallback onClick={onClickHandler}>\n\t\t\t\tClick me (useCallbackWithAnalytics)\n\t\t\t</ButtonUsingCallback>\n\t\t\t<br />\n\t\t\t<ButtonUsingEventHandlerHook onClick={onClickHandler}>\n\t\t\t\tClick me (usePlatformLeafEventHandler)\n\t\t\t</ButtonUsingEventHandlerHook>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default App;",
		],
	},
	{
		name: 'useInterval',
		description:
			'Declarative wrapper around `setInterval`. Re-runs the latest `callback` every `delay` milliseconds and clears the timer on unmount or when `delay` changes. Passing `null` for `delay` pauses the timer without unmounting the hook.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for polling, ticking clocks, or any callback that needs to fire on a fixed cadence inside a React component.',
			'Pass `null` for `delay` to pause — do not unmount the component just to stop the timer.',
			'The callback is captured by ref, so referencing the latest props/state in it does not require putting them in any dependency array.',
		],
		keywords: ['hook', 'useInterval', 'setInterval', 'polling', 'frontend-utilities'],
		category: 'hooks',
		parameters: [
			{
				name: 'callback',
				type: '() => void',
				description:
					'Function to run on each tick. The hook keeps a ref to the latest callback, so changing it does not reset the interval.',
			},
			{
				name: 'delay',
				type: 'number | null',
				description: 'Interval in milliseconds. Pass `null` to pause the timer.',
			},
		],
		returns: {
			type: 'void',
		},
		package: '@atlaskit/frontend-utilities',
		examples: [],
	},
	{
		name: 'useLocalStorage',
		description:
			'`useState`-shaped wrapper around `window.localStorage` with built-in JSON serialisation and a wrapper that survives the storage being unavailable (e.g. private browsing modes that throw). Persists `value` under `key` and rehydrates it on mount.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for user-scoped preferences that should survive a page refresh (collapsed sidebar state, last-used view, etc.).',
			'Do not store secrets or large blobs — `localStorage` is plaintext and capped at ~5 MB per origin.',
			'Values are JSON-serialised; non-serialisable values (functions, `Symbol`, circular refs) will be lost on rehydrate.',
		],
		keywords: ['hook', 'useLocalStorage', 'storage', 'persistence', 'frontend-utilities'],
		category: 'hooks',
		parameters: [
			{
				name: 'key',
				type: 'string',
				description: 'Storage key. Changing the key swaps the underlying storage entry.',
			},
			{
				name: 'defaultValue',
				type: 'T',
				description: 'Returned (and persisted) when nothing is stored under `key` yet.',
			},
		],
		returns: {
			type: '[value: T, setValue: (value: T) => void]',
			description:
				'A React-style tuple. `setValue` writes both to component state and to local storage.',
		},
		package: '@atlaskit/frontend-utilities',
		examples: [],
	},
	{
		name: 'useLocalStorageRecord',
		description:
			'Persistent bounded log built on top of `useLocalStorage`. Stores up to `maxLength` items keyed by stringified equality and exposes `putRecord` / `removeRecord` actions for append-only collections like recent searches.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for capped histories (recent searches, recently visited items, undo stacks).',
			'`removeRecord(query)` matches by JSON-stringified inclusion, not by identity — pass a stable substring of the record to remove.',
			'Equality is structural via `JSON.stringify`: pushing a record that stringifies the same as an existing one is a no-op.',
		],
		keywords: ['hook', 'useLocalStorageRecord', 'history', 'storage', 'frontend-utilities'],
		category: 'hooks',
		parameters: [
			{
				name: 'key',
				type: 'string',
				description: 'Local storage key used to persist the list.',
			},
			{
				name: 'initialValue',
				type: 'T[]',
				description: 'Initial list contents when nothing is stored yet.',
				defaultValue: '[]',
				isOptional: true,
			},
			{
				name: 'maxLength',
				type: 'number',
				description:
					'Cap on stored records. Once reached, the oldest entry is dropped on the next `putRecord`. Pass `0` to disable the cap.',
				defaultValue: '100',
				isOptional: true,
			},
		],
		returns: {
			type: '{ records: T[]; actions: { putRecord: (record: T) => void; removeRecord: (query: string) => void } }',
			description:
				'`actions` are NOT referentially stable — wrap in `useCallback` if you put them in dependency arrays.',
		},
		package: '@atlaskit/frontend-utilities',
		examples: [],
	},
	{
		name: 'usePrevious',
		description:
			'Returns the previous render-cycle value of `value`. On the first render the hook returns `undefined`; subsequent renders return the value supplied on the prior render.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for change-detection effects — e.g. firing analytics only when a prop transitions from one value to another.',
			'Do not store derived state in `usePrevious`; prefer a `useEffect` that mirrors the change you care about.',
			'`undefined` on the first render is intentional — initialise downstream logic to handle that case.',
		],
		keywords: ['hook', 'usePrevious', 'previous-value', 'frontend-utilities'],
		category: 'hooks',
		parameters: [
			{
				name: 'value',
				type: 'T',
				description: 'The value to track across renders.',
			},
		],
		returns: {
			type: 'T | undefined',
			description:
				'`undefined` on the first render, otherwise the value passed on the previous render.',
		},
		package: '@atlaskit/frontend-utilities',
		examples: [],
	},
	{
		name: 'useWhyDidUpdate',
		description:
			'Development-only debug hook that logs which dependencies changed since the previous render, using deep equality (`lodash.isEqual`). Useful for diagnosing unexpected re-renders when the data inside a prop looks identical but the reference changed.',
		status: 'general-availability',
		usageGuidelines: [
			'Use locally while debugging; remove before shipping. The hook short-circuits in production (`NODE_ENV === "production"`) but the import and call still ship.',
			'Pass the same array shape you would pass to `useEffect` deps for the comparison to mean anything.',
			"Prefer `useWhyDidUpdateShallow` when you want to mirror React's own re-render trigger.",
		],
		keywords: ['hook', 'useWhyDidUpdate', 'debug', 'rerender', 'frontend-utilities'],
		category: 'hooks',
		parameters: [
			{
				name: 'name',
				type: 'string',
				description: 'Label printed in the console log (typically the component name).',
			},
			{
				name: 'deps',
				type: 'any[]',
				description: 'Dependency array to compare across renders.',
			},
			{
				name: 'depsNames',
				type: 'string[]',
				description:
					'Optional per-dependency labels for the log output. Falls back to `dep_<index>`.',
				isOptional: true,
			},
		],
		returns: {
			type: 'void',
		},
		package: '@atlaskit/frontend-utilities',
		examples: [],
	},
	{
		name: 'useWhyDidUpdateShallow',
		description:
			'Variant of `useWhyDidUpdate` that compares dependencies with `Object.is` (shallow / reference equality) — the same comparison React itself uses to decide whether to re-render. Useful when you want to find out which prop is changing identity from one render to the next.',
		status: 'general-availability',
		usageGuidelines: [
			'Reach for this hook first when chasing "why is this re-rendering" — it matches React\'s own equality semantics. Drop to `useWhyDidUpdate` only when you suspect the content changed but the reference did not.',
			'Same production-stripping behaviour as `useWhyDidUpdate` — log calls are no-ops in prod builds.',
		],
		keywords: ['hook', 'useWhyDidUpdateShallow', 'debug', 'rerender', 'frontend-utilities'],
		category: 'hooks',
		parameters: [
			{
				name: 'name',
				type: 'string',
				description: 'Label printed in the console log (typically the component name).',
			},
			{
				name: 'deps',
				type: 'any[]',
				description: 'Dependency array to compare across renders.',
			},
			{
				name: 'depsNames',
				type: 'string[]',
				description: 'Optional per-dependency labels for the log output.',
				isOptional: true,
			},
		],
		returns: {
			type: 'void',
		},
		package: '@atlaskit/frontend-utilities',
		examples: [],
	},
	{
		name: 'useDatasourceLifecycleAnalytics',
		description:
			'Hook that exposes callbacks to fire analytics events for the lifecycle of datasources (list of links): created, updated, and deleted. Uses Smart Link context and link-client-extension for datasource operations.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to track when datasources (e.g. Jira issues list, Confluence search list) are created, updated, or deleted. Must be used inside SmartCardProvider.',
		],
		accessibilityGuidelines: ['Ensure analytics firing does not change focus or alter semantics.'],
		keywords: [
			'link-analytics',
			'analytics',
			'datasource',
			'lifecycle',
			'hooks',
			'useDatasourceLifecycleAnalytics',
		],
		category: 'linking',
		package: '@atlaskit/link-analytics',
		examples: [],
	},
	{
		name: 'useSmartLinkLifecycleAnalytics',
		description:
			'Hook that exposes callbacks to fire analytics events for the lifecycle of Smart Links: created, updated, and deleted. Uses the Smart Link context (link-provider) and analytics-next. Call linkCreated, linkUpdated, or linkDeleted when the corresponding action happens in your UI.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to track when links are created, updated, or deleted (e.g. after LinkCreate success, or when a user edits/removes a link). Must be used inside SmartCardProvider and with analytics-next.',
		],
		accessibilityGuidelines: [
			'Ensure analytics firing does not change focus, interrupt screen readers, or alter semantics.',
		],
		keywords: [
			'link-analytics',
			'analytics',
			'lifecycle',
			'hooks',
			'useSmartLinkLifecycleAnalytics',
		],
		category: 'linking',
		package: '@atlaskit/link-analytics',
		examples: [],
	},
	{
		name: 'useDatasourceClientExtension',
		description:
			'Hook that provides methods to fetch datasource details, datasource data (paginated), and actions discovery. Uses the Smart Link context client and caches responses. Required for rendering datasource tables or custom datasource UI.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building UI that loads or displays datasource data (e.g. list of links from Jira, Confluence, Assets). Must be used inside SmartCardProvider. Use getDatasourceDetails, getDatasourceData, and getActionsDiscovery as needed.',
		],
		accessibilityGuidelines: [],
		keywords: ['link-client-extension', 'hooks', 'datasource', 'useDatasourceClientExtension'],
		category: 'linking',
		package: '@atlaskit/link-client-extension',
		examples: [],
	},
	{
		name: 'useSmartLinkClientExtension',
		description:
			'Hook that extends the CardClient from link-provider with Smart Link action invocation. Accepts a CardClient and returns an invoke function to call Smart Link actions (e.g. custom actions) via the resolver.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to invoke Smart Link actions (POST to resolver /invoke) from custom UI. Pass the client from useSmartLinkContext; use the returned invoke for action execution.',
		],
		accessibilityGuidelines: [],
		keywords: [
			'link-client-extension',
			'hooks',
			'invoke',
			'actions',
			'useSmartLinkClientExtension',
		],
		category: 'linking',
		package: '@atlaskit/link-client-extension',
		examples: [],
	},
	{
		name: 'useLinkCreateCallback',
		description:
			'Hook that returns the link-create callback from LinkCreateCallbackProvider. Use to trigger or react to create success from child components.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a plugin or child of LinkCreateCallbackProvider when you need access to the create-success callback.',
		],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'hooks', 'callback', 'useLinkCreateCallback'],
		category: 'linking',
		package: '@atlaskit/link-create',
		examples: [],
	},
	{
		name: 'useWithExitWarning',
		description:
			'Hook that wires the current form or flow into the exit-warning behavior. Use when building custom create UI that should trigger the exit warning.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a component wrapped by LinkCreateExitWarningProvider when you need to register dirty state or trigger the exit warning modal.',
		],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'hooks', 'exit', 'warning', 'useWithExitWarning'],
		category: 'linking',
		package: '@atlaskit/link-create',
		examples: [],
	},
	{
		name: 'useSmartCardContext',
		description:
			'Hook to access the Smart Link context (store, client, config, extractors) from within the SmartCardProvider tree.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building custom components that need access to the link store, client, or extractors; must be used inside SmartCardProvider.',
		],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'hooks', 'context', 'useSmartCardContext'],
		category: 'linking',
		package: '@atlaskit/link-provider',
		examples: [],
	},
	{
		name: 'useSmartLinkContext',
		description:
			'Alias for useSmartCardContext. Hook to access the Smart Link context from within the SmartCardProvider tree.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building custom components that need the link store, client, or config; must be used inside SmartCardProvider.',
		],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'hooks', 'context', 'useSmartLinkContext'],
		category: 'linking',
		package: '@atlaskit/link-provider',
		examples: [],
	},
	{
		name: 'useRovoAgentActionAnalytics',
		description:
			'Creates a typed Rovo Agent event tracker enriched with analytics context and common attributes.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the actions entry point in interactive surfaces; the package root exposes a no-op compatibility implementation.',
			'Keep commonAttributes stable for the lifetime of the hook instance.',
		],
		keywords: ['rovo', 'agents', 'analytics', 'tracking hook'],
		category: 'rovo',
		package: '@atlaskit/rovo-agent-analytics',
		examples: [],
	},
	{
		name: 'useRovoAgentCreateAnalytics',
		description:
			'Tracks a correlated Rovo Agent creation session and manages its create-session identifier.',
		status: 'general-availability',
		usageGuidelines: [
			'Call trackCreateSessionStart at intent time, then reuse the returned session methods for the remaining funnel.',
		],
		keywords: ['rovo', 'agents', 'analytics', 'creation session'],
		category: 'rovo',
		package: '@atlaskit/rovo-agent-analytics',
		examples: [],
	},
	{
		name: 'usePublish',
		description: 'Returns a stable publisher for one Rovo trigger topic.',
		status: 'general-availability',
		usageGuidelines: ['Use when a React component publishes multiple payloads to the same topic.'],
		keywords: ['rovo', 'trigger', 'publish', 'hook'],
		category: 'rovo',
		returns: {
			type: '(payload: Payload) => void',
		},
		package: '@atlaskit/rovo-triggers',
		examples: [],
	},
	{
		name: 'useRovoPostMessageToPubsub',
		description: 'Returns acknowledged cross-window publishing state for Rovo trigger payloads.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a Rovo payload must cross a window boundary and report acknowledgement timeout.',
		],
		keywords: ['rovo', 'postmessage', 'pubsub', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useRovoPostMessageToPubsub>',
		},
		package: '@atlaskit/rovo-triggers',
		examples: [],
	},
	{
		name: 'useSubscribe',
		description: 'Subscribes a React component to one Rovo trigger topic.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for topic-specific Rovo event handling with optional latest-event behavior.',
		],
		keywords: ['rovo', 'trigger', 'subscribe', 'hook'],
		category: 'rovo',
		returns: {
			type: 'void',
		},
		package: '@atlaskit/rovo-triggers',
		examples: [],
	},
	{
		name: 'useSubscribeAll',
		description: 'Subscribes a React component to every Rovo trigger payload.',
		status: 'general-availability',
		usageGuidelines: [
			'Use only at bridge or instrumentation boundaries that intentionally observe all topics.',
		],
		keywords: ['rovo', 'trigger', 'subscribe all', 'hook'],
		category: 'rovo',
		returns: {
			type: 'void',
		},
		package: '@atlaskit/rovo-triggers',
		examples: [],
	},
	{
		name: 'useSmartLinkActions',
		description:
			'Hook that extracts and returns actions for a given URL. Relies on Smart Link context; usages must be wrapped in SmartCardProvider or equivalent.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building custom action UI (buttons, menus) that should expose Smart Link actions (e.g. Preview, Open) for a given URL.',
		],
		accessibilityGuidelines: [
			'When rendering actions from this hook (e.g. buttons or menus), provide accessible labels (e.g. from action.text) and ensure keyboard support.',
		],
		keywords: ['smart-card', 'hooks', 'useSmartLinkActions', 'actions'],
		category: 'linking',
		package: '@atlaskit/smart-card',
		examples: [
			"import React, { useCallback } from 'react';\nimport Button from '@atlaskit/button/default/button';\nimport { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport { Card } from '../../src';\nimport { CardAction } from '../../src/constants';\nimport { useSmartLinkActions } from '../../src/hooks';\nimport ExampleContainer from './example-container';\nconst PreviewButton = ({ url }: { url: string }) => {\n\tconst actions = useSmartLinkActions({ url, appearance: 'block' });\n\t// actions are returned in an array, find the preview action\n\tconst previewAction = actions.find((action) => action.id === 'preview-content');\n\tconst handleClick = useCallback(() => {\n\t\tif (previewAction) {\n\t\t\tpreviewAction.invoke();\n\t\t}\n\t}, [previewAction]);\n\tif (!previewAction) {\n\t\treturn null;\n\t}\n\treturn <Button onClick={handleClick}>{previewAction.text}</Button>;\n};\nconst UseSmartLinkActionsExample = (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<SmartCardProvider client={new ResolvedClient()}>\n\t\t\t<Card\n\t\t\t\tappearance=\"block\"\n\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\tactionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}\n\t\t\t/>\n\t\t\t<Box paddingBlockStart=\"space.200\">\n\t\t\t\t<PreviewButton url={ResolvedClientUrl} />\n\t\t\t</Box>\n\t\t</SmartCardProvider>\n\t</ExampleContainer>\n);\nexport default UseSmartLinkActionsExample;",
		],
	},
	{
		name: 'useSmartLinkEvents',
		description:
			'Hook that returns a SmartLinkEvents object for dispatching analytics events for a given URL. Currently supports insertSmartLink.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to fire Smart Link analytics (e.g. insert events) from custom UI that is not the default Card.',
		],
		accessibilityGuidelines: [
			'Use analytics events to understand usage; ensure event wiring does not change focus, interrupt screen readers, or alter semantics.',
		],
		keywords: ['smart-card', 'hooks', 'analytics', 'useSmartLinkEvents', 'events'],
		category: 'linking',
		package: '@atlaskit/smart-card',
		examples: [
			"import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';\nimport AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';\nimport type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';\nimport Heading from '@atlaskit/heading/heading';\nimport { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box, Text, xcss } from '@atlaskit/primitives';\nimport { Card } from '../../src';\nconst headingBoxStyles = xcss({\n\tmarginBottom: 'space.100',\n});\nconst stackBoxStyles = xcss({\n\tmarginTop: 'space.100',\n});\ntype ExampleComponentProps = {\n\tsetRecentEvents: React.Dispatch<React.SetStateAction<UIAnalyticsEvent[]>>;\n};\nconst ExampleComponent = ({ setRecentEvents }: ExampleComponentProps): JSX.Element => {\n\tconst handleOnClick = React.useCallback(\n\t\t(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {\n\t\t\te.preventDefault();\n\t\t\treturn;\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<AnalyticsListener\n\t\t\tonEvent={(event) => {\n\t\t\t\tsetRecentEvents((prevEvents) => [...prevEvents, event]);\n\t\t\t}}\n\t\t\tchannel=\"*\"\n\t\t>\n\t\t\t<AnalyticsContext\n\t\t\t\tdata={{\n\t\t\t\t\tsource: 'content',\n\t\t\t\t\tattributes: {\n\t\t\t\t\t\tdisplayCategory: 'link',\n\t\t\t\t\t\tdisplay: 'url',\n\t\t\t\t\t\tid: '123',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t<SmartCardProvider client={new ResolvedClient('dev')}>\n\t\t\t\t\t<Card\n\t\t\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\t\t\tappearance=\"inline\"\n\t\t\t\t\t\tplatform=\"web\"\n\t\t\t\t\t\tshowHoverPreview={true}\n\t\t\t\t\t\tonClick={handleOnClick}\n\t\t\t\t\t/>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</AnalyticsContext>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default (): React.JSX.Element => {\n\tconst [recentEvents, setRecentEvents] = React.useState<UIAnalyticsEvent[]>([]);\n\tconst mostRecent10Events = React.useMemo(() => {\n\t\treturn Array.from({ length: 10 }, (_, i) => {\n\t\t\treturn recentEvents.at(recentEvents.length - i - 1);\n\t\t});\n\t}, [recentEvents]);\n\treturn (\n\t\t<Box>\n\t\t\t<Box xcss={headingBoxStyles}>\n\t\t\t\t<Heading size=\"medium\">Interact with the link below and see events being fired</Heading>\n\t\t\t</Box>\n\t\t\t<ExampleComponent setRecentEvents={setRecentEvents} />\n\t\t\t<Box xcss={stackBoxStyles}>\n\t\t\t\t<Heading size=\"small\">The 10 Most Recent Events Fired</Heading>\n\t\t\t\t<ol>\n\t\t\t\t\t{mostRecent10Events.map((event, index) => {\n\t\t\t\t\t\tif (event === undefined) {\n\t\t\t\t\t\t\treturn <li key={index}></li>;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst { action, actionSubject, eventType } = event.payload;\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<li key={index}>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\tkey={index}\n\t\t\t\t\t\t\t\t>{`actionSubject: ${actionSubject}, action: ${action}, eventType: ${eventType}`}</Text>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t);\n\t\t\t\t\t})}\n\t\t\t\t</ol>\n\t\t\t</Box>\n\t\t</Box>\n\t);\n};",
		],
	},
	{
		name: 'useChooseObjectExample',
		description: 'Returns object-example selection state for smart-creation prompts.',
		status: 'general-availability',
		usageGuidelines: ['Use within object-aware smart-creation example selection.'],
		keywords: ['rovo', 'smart creation', 'object example', 'hook'],
		category: 'rovo',
		returns: {
			type: '(choice: string, examples: ObjectExamplesConfig) => void',
		},
		package: '@atlassian/conversation-assistant',
		examples: [],
	},
	{
		name: 'useInputHatSelectedAgent',
		description: 'Resolves the selected agent displayed by the refreshed chat input hat.',
		status: 'general-availability',
		usageGuidelines: ['Use when composing the package refreshed input-hat experience.'],
		keywords: ['rovo', 'chat', 'agent', 'input hat'],
		category: 'rovo',
		returns: {
			type: 'SelectedAgentForInputHat | undefined',
		},
		package: '@atlassian/conversation-assistant',
		examples: [],
	},
	{
		name: 'usePromptLibraryFilters',
		description: 'Manages prompt-library category, search, and visible prompt filtering.',
		status: 'general-availability',
		usageGuidelines: ['Use when building a custom prompt-library presentation.'],
		keywords: ['rovo', 'prompt library', 'filter', 'hook'],
		category: 'rovo',
		returns: {
			type: 'UsePromptLibraryFiltersResult',
		},
		package: '@atlassian/conversation-assistant',
		examples: [],
	},
	{
		name: 'useAllAttachmentsStore',
		description:
			'Selects all file and external-context attachments for one prompt-input key and exposes attachment actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when rendering a unified ordered attachment surface for one prompt input.',
		],
		keywords: ['rovo', 'chat', 'attachments', 'selector'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useAttachmentsStore',
		description:
			'Low-level shared attachment store exposing keyed file and external-context state with mutation actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Prefer a keyed selector hook when a consumer only needs one attachment view.',
		],
		keywords: ['rovo', 'chat', 'attachments', 'store'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useChatModeState',
		description: 'Selects the fully derived ChatMode for one prompt draft and mode key.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when only state is required; select useChatModeStore when mutation actions are also needed.',
		],
		keywords: ['rovo', 'chat', 'chat mode', 'state hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useChatModeStore',
		description:
			'Selects derived mode state for one key and exposes the complete chat-mode mutation action collection.',
		status: 'general-availability',
		usageGuidelines: [
			'Use one stable key per prompt draft to avoid leaking mode choices between independent inputs.',
		],
		keywords: ['rovo', 'chat', 'chat mode', 'store hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useChatModeStoreActions',
		description: 'Returns chat-mode mutation and lookup actions without subscribing to mode state.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for event handlers and orchestration that do not need to rerender when mode state changes.',
		],
		keywords: ['rovo', 'chat', 'chat mode', 'actions hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useCurrentPageAsContext',
		description: 'Manages whether the current product page is attached as prompt context.',
		status: 'general-availability',
		usageGuidelines: ['Use when the composer offers a current-page context toggle.'],
		keywords: ['rovo', 'chat', 'page context', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useCurrentPageAsContext>',
		},
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useExternalContextsStore',
		description:
			'Selects external prompt contexts for one prompt-input key and exposes attachment actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for non-file context chips while preserving the shared keyed attachment lifecycle.',
		],
		keywords: ['rovo', 'chat', 'external context', 'selector'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useFileAttachmentsStore',
		description:
			'Selects uploaded file attachments for one prompt-input key and exposes attachment actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for file-only previews, validation, upload progress, and removal controls.',
		],
		keywords: ['rovo', 'chat', 'file attachments', 'selector'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useFileUploadTrigger',
		description: 'Returns the controller used to open the prompt file-upload dialog.',
		status: 'general-availability',
		usageGuidelines: ['Use when a React action needs to invoke prompt attachment selection.'],
		keywords: ['rovo', 'chat', 'file upload', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useFileUploadTrigger>',
		},
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'usePageContextType',
		description: 'Resolves the supported Rovo page-context type for the current location.',
		status: 'general-availability',
		usageGuidelines: ['Use when prompt behavior depends on the current product page type.'],
		keywords: ['rovo', 'chat', 'page context', 'type'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof usePageContextType>',
		},
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useSelectedAgentDraftController',
		description: 'Coordinates prompt drafts associated with the currently selected agent.',
		status: 'general-availability',
		usageGuidelines: ['Use where changing agents must preserve or restore agent-specific drafts.'],
		keywords: ['rovo', 'chat', 'agent', 'draft'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useSelectedAgentDraftController>',
		},
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useWebSearchConfiguration',
		description: 'Reads and updates the prompt web-search configuration.',
		status: 'general-availability',
		usageGuidelines: ['Use when a prompt surface exposes web-search configuration controls.'],
		keywords: ['rovo', 'chat', 'web search', 'configuration'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useWebSearchConfiguration>',
		},
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useWindowLocation',
		description: 'Returns the window location supplied to current-page context controllers.',
		status: 'general-availability',
		usageGuidelines: ['Use within a WindowLocationContext-backed prompt surface.'],
		keywords: ['rovo', 'chat', 'window', 'location'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useWindowLocation>',
		},
		package: '@atlassian/conversation-assistant-chat-prompt-input',
		examples: [],
	},
	{
		name: 'useEditorPreset',
		description: 'Builds the editor preset and plugin API used by the Rovo Chat prompt editor.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to configure standard Rovo prompt editor behavior and connector sources.',
		],
		keywords: ['rovo', 'chat', 'editor', 'preset', 'hook'],
		category: 'rovo',
		returns: {
			type: '{ preset: EditorPreset; editorApi?: PublicPluginAPI }',
		},
		package: '@atlassian/conversation-assistant-content-renderer',
		examples: [],
	},
	{
		name: 'useRovoMentionProvider',
		description: 'Reads the optional mention provider supplied to the current Rovo content tree.',
		status: 'general-availability',
		usageGuidelines: ['Use in nested editor or renderer integrations that need host mention data.'],
		keywords: ['rovo', 'mentions', 'provider', 'hook', 'editor'],
		category: 'rovo',
		returns: {
			type: '{ value?: MentionProvider }',
		},
		package: '@atlassian/conversation-assistant-content-renderer',
		examples: [],
	},
	{
		name: 'useRovoProfilecardProvider',
		description:
			'Reads the optional profile-card provider supplied to the current Rovo content tree.',
		status: 'general-availability',
		usageGuidelines: ['Use in nested content that needs host profile-card resolution.'],
		keywords: ['rovo', 'profile card', 'provider', 'hook', 'people'],
		category: 'rovo',
		returns: {
			type: '{ value?: ProfilecardProvider }',
		},
		package: '@atlassian/conversation-assistant-content-renderer',
		examples: [],
	},
	{
		name: 'useRovoEntitlement',
		description:
			'Reads the current Rovo enabled state and optional reason from the entitlement store.',
		status: 'general-availability',
		usageGuidelines: ['Use to gate Rovo Chat behavior without duplicating host entitlement state.'],
		keywords: ['rovo', 'chat', 'entitlement', 'state', 'hook'],
		category: 'rovo',
		returns: {
			type: '{ isRovoEnabled: boolean; reason?: string }',
		},
		package: '@atlassian/conversation-assistant-entitlement',
		examples: [],
	},
	{
		name: 'useRovoEntitlementActions',
		description: 'Returns the action used to update the shared Rovo entitlement state.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a hook-based host integration needs to update entitlement directly.',
		],
		keywords: ['rovo', 'chat', 'entitlement', 'actions', 'hook'],
		category: 'rovo',
		returns: {
			type: '{ setIsRovoEnabled(isRovoEnabled: boolean, reason?: string): void }',
		},
		package: '@atlassian/conversation-assistant-entitlement',
		examples: [],
	},
	{
		name: 'useExternalContextBrowser',
		description:
			'Coordinates external context menu items, browser content, and selected prompt contexts.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in a Rovo prompt integration that accepts context from one or more product providers.',
		],
		keywords: ['rovo', 'chat', 'context', 'browser', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ExternalContextBrowserState',
		},
		package: '@atlassian/conversation-assistant-external-context',
		examples: [],
	},
	{
		name: 'useAIMateExperienceTracker',
		description:
			'Returns the Rovo Chat experience tracker API with analytics and UI-mode integration.',
		status: 'general-availability',
		usageGuidelines: ['Use to start, succeed, fail, or abort named Rovo Chat experiences.'],
		keywords: ['rovo', 'experience', 'ufo', 'hook'],
		category: 'analytics',
		returns: {
			type: 'ExperienceTrackerAPI',
		},
		package: '@atlassian/conversation-assistant-instrumentation',
		examples: [],
	},
	{
		name: 'useAnalytics',
		description:
			'Returns the Rovo Chat analytics API with contextual properties applied to events.',
		status: 'general-availability',
		usageGuidelines: ['Use from components that emit Rovo Chat analytics events.'],
		keywords: ['rovo', 'analytics', 'events', 'hook'],
		category: 'analytics',
		returns: {
			type: 'UseAnalyticsAPI',
		},
		package: '@atlassian/conversation-assistant-instrumentation',
		examples: [],
	},
	{
		name: 'useAnalyticsPropertiesContext',
		description: 'Reads the current Rovo Chat analytics properties context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within an analytics properties provider to access its current mode and property ref.',
		],
		keywords: ['rovo', 'analytics', 'context', 'hook'],
		category: 'analytics',
		returns: {
			type: 'AnalyticsPropertiesContextProps',
		},
		package: '@atlassian/conversation-assistant-instrumentation',
		examples: [],
	},
	{
		name: 'useUFOLabelStackSetter',
		description: 'Returns a setter for the component label stack attached to Rovo Chat UFO events.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a surface must propagate its UFO component labels to experience tracking.',
		],
		keywords: ['rovo', 'experience', 'ufo', 'labels'],
		category: 'analytics',
		returns: {
			type: '(componentLabelStack: LabelStack) => void',
		},
		package: '@atlassian/conversation-assistant-instrumentation',
		examples: [],
	},
	{
		name: 'useActionRenderer',
		description: 'Selects the interactive or read-only renderer for a Rovo message action.',
		status: 'general-availability',
		usageGuidelines: ['Use when rendering one action with the package action registry.'],
		keywords: ['rovo', 'chat', 'actions', 'renderer', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ActionRenderer | undefined',
		},
		package: '@atlassian/conversation-assistant-message-actions',
		examples: [],
	},
	{
		name: 'useCustomMessageActionBroker',
		description: 'Returns the broker used to resolve custom Rovo message action renderers.',
		status: 'general-availability',
		usageGuidelines: ['Use in the message action host to find product-specific action renderers.'],
		keywords: ['rovo', 'chat', 'actions', 'broker', 'hook'],
		category: 'rovo',
		returns: {
			type: 'CustomMessageActionBroker',
		},
		package: '@atlassian/conversation-assistant-message-actions',
		examples: [],
	},
	{
		name: 'useConversationModal',
		description:
			'Shared open state and selected conversation for edit and delete conversation modals.',
		status: 'general-availability',
		usageGuidelines: [
			'Open with the target conversation and explicit edit or delete mode before rendering the corresponding modal.',
		],
		keywords: ['rovo', 'chat', 'conversation', 'modal hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useEditorPlaceholder',
		description:
			'Controls prompt placeholders, ADF placeholder content, inline cards, focus intent, and clearing.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the ADF-specific insertion path when the caller already owns a parsed document.',
		],
		keywords: ['rovo', 'chat', 'editor', 'placeholder hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useHighlightActionsEditorPlaceholder',
		description:
			'Seeds and clears ADF editor content created from highlight actions or URL parameters.',
		status: 'general-availability',
		usageGuidelines: [
			'Set skipPlaceholderPrompt when pre-filling an editable draft that must not receive highlight-action trailer copy.',
		],
		keywords: ['rovo', 'chat', 'highlight actions', 'editor hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useHighlightActionsEditorPlaceholderStore',
		description:
			'Low-level shared store hook for highlight-action editor placeholder state and source metadata.',
		status: 'general-availability',
		usageGuidelines: [
			'Prefer useHighlightActionsEditorPlaceholder for normal insertion and clearing behavior.',
		],
		keywords: ['rovo', 'chat', 'highlight actions', 'store'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'usePlaceholderStore',
		description: 'Low-level shared store hook for reading and replacing editor placeholder state.',
		status: 'general-availability',
		usageGuidelines: [
			'Prefer useEditorPlaceholder unless direct store access is required for integration or testing.',
		],
		keywords: ['rovo', 'chat', 'editor placeholder', 'store'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useScopePopupSizing',
		description:
			'Tracks a scope popup trigger and keeps popup width and placement inside its live panel boundary.',
		status: 'general-availability',
		usageGuidelines: [
			'Pass the popup trigger through setTrigger so resize and boundary observations remain current while open.',
		],
		keywords: ['rovo', 'chat', 'scope popup', 'sizing'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useSideNavModal',
		description:
			'Accesses provider-backed open, close, open-state, and disabled controls for the side-navigation modal.',
		status: 'general-availability',
		usageGuidelines: [
			'Call within SideNavModalProvider; disabled providers intentionally return inert open and close controls.',
		],
		keywords: ['rovo', 'chat', 'settings modal', 'control hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useSideNavModalHighlightTarget',
		description:
			'Returns the content target requested for visual highlighting while the modal is open.',
		status: 'general-availability',
		usageGuidelines: [
			'Apply highlighting only to the matching target and clear it naturally when the modal closes.',
		],
		keywords: ['rovo', 'chat', 'settings modal', 'highlight hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useSideNavModalScrollToAvailableApps',
		description:
			'Reports whether the active modal request should scroll connected-app content to available apps.',
		status: 'general-availability',
		usageGuidelines: [
			'Consume inside provider-backed connected-app content and react only while the modal is open.',
		],
		keywords: ['rovo', 'chat', 'connected apps', 'scroll hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useSmoothScrollAnchor',
		description:
			'Controls smooth chat scrolling while preserving room to align the latest assistant message.',
		status: 'general-availability',
		usageGuidelines: [
			'Attach data-scroll-anchor="assistant-message" to assistant messages used by scrollToLatestMessage.',
		],
		keywords: ['rovo', 'chat', 'scroll', 'anchor'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useUpdateTime',
		description: 'Formats a conversation timestamp and refreshes it at the appropriate interval.',
		status: 'general-availability',
		usageGuidelines: ['Use for relative timestamps in conversation-history items.'],
		keywords: ['rovo', 'chat', 'time', 'hook'],
		category: 'rovo',
		returns: {
			type: 'string',
		},
		package: '@atlassian/conversation-assistant-ui-components',
		examples: [],
	},
	{
		name: 'useAutoApplyAvailability',
		description:
			'Determines whether auto-apply is available for the current product and conversation context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use before rendering auto-apply controls so agentic and unsupported page contexts stay hidden.',
		],
		keywords: ['rovo', 'creation', 'auto apply', 'availability'],
		category: 'rovo',
		package: '@atlassian/creation-settings',
		examples: [],
	},
	{
		name: 'useAutoApplyState',
		description:
			'Reads and updates the auto-apply preference with backend persistence and a local-storage fallback.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the package root import; the auto-apply subpath exposes the same hook.',
			'Handle rejected setEnabled calls when the host needs to surface persistence failures.',
		],
		keywords: ['rovo', 'creation', 'auto apply', 'state'],
		category: 'rovo',
		package: '@atlassian/creation-settings',
		examples: [],
	},
	{
		name: 'useAiCreateProjectContext',
		description: 'Resolves Jira project context for an AI-assisted creation flow.',
		status: 'general-availability',
		usageGuidelines: ['Use when draft creation needs hydrated Jira project context.'],
		keywords: ['rovo', 'jira', 'project', 'context'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useAiCreateProjectContext>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useAifcAnalytics',
		description: 'Returns analytics helpers for AI-assisted Jira work-item creation.',
		status: 'general-availability',
		usageGuidelines: ['Use within package-integrated creation UI that emits AIFC analytics.'],
		keywords: ['rovo', 'jira', 'creation', 'analytics'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useAifcAnalytics>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useAreAllCreated',
		description: 'Reports whether every draft work item for a message has been created.',
		status: 'general-availability',
		usageGuidelines: ['Use to derive completion state for a message-scoped creation flow.'],
		keywords: ['rovo', 'jira', 'draft work item', 'created'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useAreAllCreated>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useAreAllDismissed',
		description: 'Reports whether every draft work item for a message has been dismissed.',
		status: 'general-availability',
		usageGuidelines: ['Use to derive dismissed state for a message-scoped creation flow.'],
		keywords: ['rovo', 'jira', 'draft work item', 'dismissed'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useAreAllDismissed>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useCreateDraftWorkItems',
		description: 'Creates eligible Jira draft work items and exposes action callbacks.',
		status: 'general-availability',
		usageGuidelines: ['Use to connect creation UI to the draft-work-item submission flow.'],
		keywords: ['rovo', 'jira', 'draft work item', 'create'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useCreateDraftWorkItems>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useCreateIssuesSuccessFlags',
		description: 'Returns the success-flag action used after Jira work items are created.',
		status: 'general-availability',
		usageGuidelines: ['Use to show package-standard success feedback after creation.'],
		keywords: ['rovo', 'jira', 'create', 'flag'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useCreateIssuesSuccessFlags>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useDraftWorkItems',
		description: 'Returns the current draft work items and their controller state.',
		status: 'general-availability',
		usageGuidelines: ['Use as the main draft-work-item data source for creation UI.'],
		keywords: ['rovo', 'jira', 'draft work item', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useDraftWorkItems>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useGetActiveOrFinishedDraftWorkItemsCount',
		description: 'Returns the number of active or completed draft work items for a message.',
		status: 'general-availability',
		usageGuidelines: ['Use for progress and summary counts in creation UI.'],
		keywords: ['rovo', 'jira', 'draft work item', 'count'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useGetActiveOrFinishedDraftWorkItemsCount>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useGetActivePlannedChildInvocationIdsByParent',
		description: 'Groups active planned child invocation identifiers by parent work item.',
		status: 'general-availability',
		usageGuidelines: ['Use when parent work-item state depends on active planned children.'],
		keywords: ['rovo', 'jira', 'draft work item', 'invocation'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useGetActivePlannedChildInvocationIdsByParent>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useGetDraftWorkItemsToCreate',
		description: 'Returns the draft work items currently eligible for creation.',
		status: 'general-availability',
		usageGuidelines: ['Use to build the payload submitted by a draft-work-item creation action.'],
		keywords: ['rovo', 'jira', 'draft work item', 'create'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useGetDraftWorkItemsToCreate>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useGetDraftWorkItemsWithHierarchy',
		description: 'Returns draft work items with their calculated parent-child hierarchy.',
		status: 'general-availability',
		usageGuidelines: ['Use when rendering or validating hierarchical draft work items.'],
		keywords: ['rovo', 'jira', 'draft work item', 'hierarchy'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useGetDraftWorkItemsWithHierarchy>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useHasAppliedDraftEdits',
		description: 'Reports whether edits have been applied to message-scoped draft work items.',
		status: 'general-availability',
		usageGuidelines: ['Use to distinguish original drafts from user-edited drafts.'],
		keywords: ['rovo', 'jira', 'draft work item', 'edits'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useHasAppliedDraftEdits>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useRovoBridgeAPI',
		description: 'Connects Jira draft-work-item creation to the Rovo bridge API.',
		status: 'general-availability',
		usageGuidelines: ['Use where the creation flow exchanges state with a Rovo host.'],
		keywords: ['rovo', 'jira', 'bridge', 'api'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useRovoBridgeAPI>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useValidateIssuesToCreate',
		description: 'Validates Jira draft work items before they are submitted for creation.',
		status: 'general-availability',
		usageGuidelines: ['Use before enabling or invoking the create-work-items action.'],
		keywords: ['rovo', 'jira', 'draft work item', 'validation'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useValidateIssuesToCreate>',
		},
		package: '@atlassian/jira-create-work-items',
		examples: [],
	},
	{
		name: 'useAllMessages',
		description:
			'Returns every non-dismissed message in a placement with a placement-bound wrapper. Use it when one surface renders messages from multiple templates.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a placement intentionally renders messages from more than one template.',
			'Use `useMessageInstances` or `useMessageData` when the surface is scoped to one template.',
			'Iterate `messageInstanceIds` and read each message inside the `PostOfficeAllMessages` render prop; rendering message data directly bypasses Post Office orchestration, analytics, and lifecycle behavior.',
			'The wrapper only needs `messageInstanceId`; `messageTemplateId` and `messageCategory` are inferred from the fetched message, so you do not need to pass them.',
			'Prefer the render prop; `messageInstanceIds` is always available for iteration. Use `dataOutsideWrapper: true` only if you absolutely need the `messages` array (message data) outside the wrapper.',
		],
		keywords: [
			'post office',
			'headless messages',
			'all messages',
			'multiple templates',
			'choreographer',
			'message lifecycle',
		],
		category: 'messaging',
		parameters: [
			{
				name: 'placementId',
				type: 'string',
				description: 'Placement to fetch.',
				defaultValue: "'headless'",
				isOptional: true,
			},
			{
				name: 'options',
				type: 'UseAllMessagesOptions<TMessage, TExtension>',
				description: 'Optional matching, validation, and data-source configuration.',
				isOptional: true,
			},
		],
		returns: {
			type: 'UseAllMessagesResult<TMessage>',
			description:
				'Message instance IDs to iterate, loading and error state, dismissal controls, and PostOfficeAllMessages whose render prop receives each message. The `messages` array (message data) is only present when `dataOutsideWrapper: true`.',
		},
		package: '@atlassian/post-office-headless-api',
		examples: [
			"import { useAllMessages } from '@atlassian/post-office-headless-api/hooks/useAllMessages';\ntype ProductHomeMessage = {\n\tmessageTemplateId: string;\n\tcontext: {\n\t\ttitle: string;\n\t\tbody: string;\n\t};\n};\nconst ProductHomeMessages = (): JSX.Element => {\n\tconst { messageInstanceIds, PostOfficeAllMessages } =\n\t\tuseAllMessages<ProductHomeMessage>('product-home');\n\treturn (\n\t\t<>\n\t\t\t{messageInstanceIds.map((messageInstanceId) => (\n\t\t\t\t<PostOfficeAllMessages key={messageInstanceId} messageInstanceId={messageInstanceId}>\n\t\t\t\t\t{(message) => (\n\t\t\t\t\t\t<section aria-label={message.context.title}>\n\t\t\t\t\t\t\t<h2>{message.context.title}</h2>\n\t\t\t\t\t\t\t<p>{message.context.body}</p>\n\t\t\t\t\t\t</section>\n\t\t\t\t\t)}\n\t\t\t\t</PostOfficeAllMessages>\n\t\t\t))}\n\t\t</>\n\t);\n};\nexport default ProductHomeMessages;",
		],
	},
	{
		name: 'useMessageData',
		description:
			'Returns the single non-dismissed instance of one message template with a fully bound wrapper. Use it when the template can produce at most one active instance.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when one template can produce at most one active message instance.',
			'Use `useMessageInstances` when multiple instances are valid rather than treating them as an error.',
			'Render the message through the returned `PostOfficeMessage` and read it inside the render prop; rendering message data directly bypasses Post Office orchestration, analytics, and lifecycle behavior.',
			'Prefer the render prop; `messageInstanceId` is always available. Use `dataOutsideWrapper: true` only if you absolutely need `message` (message data) outside the wrapper.',
		],
		keywords: [
			'post office',
			'headless messages',
			'single message',
			'message template',
			'choreographer',
			'message lifecycle',
		],
		category: 'messaging',
		parameters: [
			{
				name: 'selector',
				type: 'UseMessageDataSelector',
				description: 'Placement and template to select.',
			},
			{
				name: 'options',
				type: 'UseMessageDataOptions<TMessage, TExtension>',
				description: 'Optional matching, validation, and data-source configuration.',
				isOptional: true,
			},
		],
		returns: {
			type: 'UseMessageDataResult<TMessage>',
			description:
				'The resolved messageInstanceId, loading and error state, dismissal controls, and an optional PostOfficeMessage wrapper whose render prop receives the message. The `message` value (message data) is only present when `dataOutsideWrapper: true`.',
		},
		package: '@atlassian/post-office-headless-api',
		examples: [
			"import { useMessageData } from '@atlassian/post-office-headless-api/hooks/useMessageData';\ntype TrialReminderMessage = {\n\tmessageTemplateId: 'trial-reminder';\n\tcontext: {\n\t\ttitle: string;\n\t\tbody: string;\n\t};\n};\nconst TrialReminder = (): JSX.Element | null => {\n\tconst { PostOfficeMessage } = useMessageData<TrialReminderMessage>({\n\t\tplacementId: 'product-home',\n\t\tmessageTemplateId: 'trial-reminder',\n\t});\n\tif (!PostOfficeMessage) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<PostOfficeMessage>\n\t\t\t{(message) => (\n\t\t\t\t<section aria-label={message.context.title}>\n\t\t\t\t\t<h2>{message.context.title}</h2>\n\t\t\t\t\t<p>{message.context.body}</p>\n\t\t\t\t</section>\n\t\t\t)}\n\t\t</PostOfficeMessage>\n\t);\n};\nexport default TrialReminder;",
		],
	},
	{
		name: 'useMessageInstances',
		description:
			'Returns every non-dismissed instance of one message template with a template-bound wrapper. Use it when an implicit message creator can produce multiple simultaneous instances.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for one template only when more than one message instance can be active at the same time.',
			'Prefer `useMessageData` when the template can produce at most one active instance.',
			'Iterate `messageInstanceIds` and read each message inside the `PostOfficeMessageInstance` render prop; rendering message data directly bypasses Post Office orchestration, analytics, and lifecycle behavior.',
			'Prefer the render prop; `messageInstanceIds` is always available for iteration. Use `dataOutsideWrapper: true` only if you absolutely need the `messages` array (message data) outside the wrapper.',
		],
		keywords: [
			'post office',
			'headless messages',
			'message instances',
			'implicit messages',
			'choreographer',
			'message lifecycle',
		],
		category: 'messaging',
		parameters: [
			{
				name: 'selector',
				type: "{ placementId?: string; messageTemplateId: TMessage['messageTemplateId'] }",
				description: 'Placement and template to select.',
			},
			{
				name: 'options',
				type: 'UseMessageInstancesOptions<TMessage, TExtension>',
				description: 'Optional matching, validation, and data-source configuration.',
				isOptional: true,
			},
		],
		returns: {
			type: 'UseMessageInstancesResult<TMessage>',
			description:
				'Message instance IDs to iterate, loading and error state, dismissal controls, and PostOfficeMessageInstance whose render prop receives each message. The `messages` array (message data) is only present when `dataOutsideWrapper: true`.',
		},
		package: '@atlassian/post-office-headless-api',
		examples: [
			"import { useMessageInstances } from '@atlassian/post-office-headless-api/hooks/useMessageInstances';\ntype AssignedIssueMessage = {\n\tmessageTemplateId: 'assigned-issue';\n\tcontext: {\n\t\tissueKey: string;\n\t\tsummary: string;\n\t};\n};\nconst AssignedIssueMessages = (): JSX.Element => {\n\tconst { messageInstanceIds, PostOfficeMessageInstance } =\n\t\tuseMessageInstances<AssignedIssueMessage>({\n\t\t\tplacementId: 'jira-navigation',\n\t\t\tmessageTemplateId: 'assigned-issue',\n\t\t});\n\treturn (\n\t\t<>\n\t\t\t{messageInstanceIds.map((messageInstanceId) => (\n\t\t\t\t<PostOfficeMessageInstance key={messageInstanceId} messageInstanceId={messageInstanceId}>\n\t\t\t\t\t{(message) => (\n\t\t\t\t\t\t<section aria-label={`Assigned issue ${message.context.issueKey}`}>\n\t\t\t\t\t\t\t<h2>{message.context.issueKey}</h2>\n\t\t\t\t\t\t\t<p>{message.context.summary}</p>\n\t\t\t\t\t\t</section>\n\t\t\t\t\t)}\n\t\t\t\t</PostOfficeMessageInstance>\n\t\t\t))}\n\t\t</>\n\t);\n};\nexport default AssignedIssueMessages;",
		],
	},
	{
		name: 'usePlacementData',
		description:
			'Fetches raw headless data for a placement and returns a placement-bound message wrapper. Use it when the higher-level selection hooks do not fit the response shape or filtering needs.',
		status: 'general-availability',
		usageGuidelines: [
			'This is the low-level escape hatch: it exposes raw `data` and does not offer render-prop access to message content. Prefer `useAllMessages`, `useMessageInstances`, or `useMessageData` — which deliver each message through a wrapper render prop — and only reach for `usePlacementData` when the response shape or filtering does not fit those.',
			'Render every visible message through `PostOfficePlacementMessage`; rendering message data directly bypasses Post Office orchestration, analytics, and lifecycle behavior.',
		],
		keywords: [
			'post office',
			'headless messages',
			'placement data',
			'choreographer',
			'message lifecycle',
			'analytics',
		],
		category: 'messaging',
		parameters: [
			{
				name: 'placementId',
				type: 'string',
				description: 'Placement to fetch.',
				defaultValue: "'headless'",
				isOptional: true,
			},
			{
				name: 'options',
				type: 'UsePlacementDataOptions',
				description: 'Optional data source and additive query-string configuration.',
				isOptional: true,
			},
		],
		returns: {
			type: 'UsePlacementDataResult<PlacementDataEndpointData<TMessage, TExtension>>',
			description:
				'Raw placement data, loading and error state, dismissal controls, and PostOfficePlacementMessage for rendering each message.',
		},
		package: '@atlassian/post-office-headless-api',
		examples: [
			"import { usePlacementData } from '@atlassian/post-office-headless-api/hooks/usePlacementData';\ntype ReleaseAnnouncementMessage = {\n\tmessageTemplateId: 'release-announcement';\n\tcontext: {\n\t\ttitle: string;\n\t\tbody: string;\n\t};\n};\nconst ReleaseAnnouncementPlacement = (): JSX.Element => {\n\tconst { data, dismissedIds, PostOfficePlacementMessage } =\n\t\tusePlacementData<ReleaseAnnouncementMessage>('product-home');\n\tconst visibleMessages =\n\t\tdata?.messages.filter((message) => !dismissedIds.has(message.messageInstanceId)) ?? [];\n\treturn (\n\t\t<>\n\t\t\t{visibleMessages.map((message) => (\n\t\t\t\t<PostOfficePlacementMessage\n\t\t\t\t\tkey={message.messageInstanceId}\n\t\t\t\t\tmessageInstanceId={message.messageInstanceId}\n\t\t\t\t\tmessageTemplateId={message.messageTemplateId}\n\t\t\t\t\tmessageCategory={message.messageCategory}\n\t\t\t\t>\n\t\t\t\t\t{() => (\n\t\t\t\t\t\t<section aria-label={message.context.title}>\n\t\t\t\t\t\t\t<h2>{message.context.title}</h2>\n\t\t\t\t\t\t\t<p>{message.context.body}</p>\n\t\t\t\t\t\t</section>\n\t\t\t\t\t)}\n\t\t\t\t</PostOfficePlacementMessage>\n\t\t\t))}\n\t\t</>\n\t);\n};\nexport default ReleaseAnnouncementPlacement;",
		],
	},
	{
		name: 'useRovoActionTrigger',
		description:
			'Returns a dispatcher for callbacks, skills, chats, and base actions in an available Rovo UI mode.',
		status: 'general-availability',
		usageGuidelines: [
			'Provide the host sidebar adapter and stable product identifier.',
			'Request a mode only when the host has declared that experience available; unsupported modes fall back safely.',
		],
		keywords: ['rovo', 'actions', 'trigger', 'experience mode'],
		category: 'rovo',
		package: '@atlassian/rovo-action-trigger',
		examples: [],
	},
	{
		name: 'useClearFormValue',
		description: 'Returns a callback for clearing one declarative form property.',
		status: 'general-availability',
		usageGuidelines: ['Use the schema property key whose current value should become undefined.'],
		keywords: ['rovo', 'agents', 'form clear', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useDeclarativeUi',
		description:
			'Returns the current declarative UI configuration, form data, overrides, and query handler.',
		status: 'general-availability',
		usageGuidelines: [
			'Call only below DeclarativeUiProvider; the hook throws when context is missing.',
		],
		keywords: ['rovo', 'agents', 'declarative ui', 'context hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useFormValue',
		description: 'Reads one typed value from the current declarative form data.',
		status: 'general-availability',
		usageGuidelines: ['Use the property key defined by the current input schema.'],
		keywords: ['rovo', 'agents', 'form value', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useQuerySchema',
		description: 'Resolves a query action from a declarative data-schema path.',
		status: 'general-availability',
		usageGuidelines: [
			'Use dataSchema/queryData paths; unsupported or missing paths return undefined.',
		],
		keywords: ['rovo', 'agents', 'query schema', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useSchemaProperty',
		description: 'Returns one input-property definition from the current connection schema.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a custom control needs its title, type, required state, or description.',
		],
		keywords: ['rovo', 'agents', 'schema property', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useStaticData',
		description: 'Resolves a static data array from a declarative data-schema path.',
		status: 'general-availability',
		usageGuidelines: [
			'Use dataSchema/staticData paths; unsupported or missing paths return undefined.',
		],
		keywords: ['rovo', 'agents', 'static data', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useUpdateFormValue',
		description: 'Returns a callback for updating one declarative form property.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in custom controls so updates flow through the provider onChange handler.',
		],
		keywords: ['rovo', 'agents', 'form update', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-declarative-ui',
		examples: [],
	},
	{
		name: 'useAgentCrossProductUrlWrapper',
		description:
			'Returns a URL wrapper that adds host-product XPC attribution when available and enabled.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a SmartCardProvider when navigation crosses from a host product into Atlas.',
			'The returned function is an identity wrapper when product attribution is unavailable.',
		],
		keywords: ['rovo', 'agents', 'xpc', 'url wrapper'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-url-utils',
		examples: [],
	},
	{
		name: 'useAgentUrlActions',
		description: 'Returns analytics-aware and feature-gated navigation actions for a Rovo Agent.',
		status: 'general-availability',
		usageGuidelines: [
			'Provide a Relay environment because version capability checks and duplication use Relay.',
			'Use this hook for interactive agent actions so URL selection, flags, feedback, and analytics remain consistent.',
		],
		keywords: ['rovo', 'agents', 'navigation', 'actions hook'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-url-utils',
		examples: [],
	},
	{
		name: 'useSBSEvaluationBridge',
		description:
			'Coordinates evaluation state and messages between Rovo Chat and the browser extension bridge.',
		status: 'general-availability',
		usageGuidelines: [
			'Mount once per chat surface and feed it current response-completion state and content.',
		],
		keywords: ['rovo', 'chat', 'evaluation', 'bridge hook'],
		category: 'rovo',
		package: '@atlassian/rovo-chat-side-by-side-evaluation',
		examples: [],
	},
	{
		name: 'useSBSTrigger',
		description:
			'Determines whether a submitted prompt should start an evaluation and be held for consent.',
		status: 'general-availability',
		usageGuidelines: [
			'If the trigger holds a query, register its release callback before waiting for consent.',
		],
		keywords: ['rovo', 'chat', 'evaluation', 'trigger hook'],
		category: 'rovo',
		package: '@atlassian/rovo-chat-side-by-side-evaluation',
		examples: [],
	},
	{
		name: 'useActionsContext',
		description: 'Returns the nearest custom action configuration or package defaults.',
		status: 'general-availability',
		usageGuidelines: [
			'The hook is safe without a provider and returns disabled/default configuration.',
		],
		keywords: ['rovo', 'conversation actions', 'context', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useConversationActionsStore',
		description: 'Reads selected Rovo conversation-action store state and actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for components that need a selected combination of conversation-action state and actions.',
		],
		keywords: ['rovo', 'conversation actions', 'store', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useConversationActionsStore>',
		},
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useConversationActionsStoreActions',
		description: 'Returns the mutation actions for the Rovo conversation-action store.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a component updates conversation-action state without subscribing to values.',
		],
		keywords: ['rovo', 'conversation actions', 'store', 'actions'],
		category: 'rovo',
		returns: {
			type: 'ConversationActionsStoreActions',
		},
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useConversationActionsStoreState',
		description: 'Returns the current Rovo conversation-action store state.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a component reads conversation-action state without dispatching actions.',
		],
		keywords: ['rovo', 'conversation actions', 'store', 'state'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useConversationActionsStoreState>',
		},
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useConvoStarterActionPrompt',
		description: 'Selects the currently active proactive-nudge conversation starter prompt.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a consumer only needs the active nudge prompt rather than the full action store.',
		],
		keywords: ['rovo', 'conversation starter', 'store', 'selector'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useCreatePromptInitialData',
		description: 'Builds initial create-prompt form data for edit and duplicate flows.',
		status: 'general-availability',
		usageGuidelines: ['Pass only one source card; duplicate mode prefixes the copied title.'],
		keywords: ['rovo', 'prompts', 'initial data', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'usePageContextType',
		description: 'Tracks browser navigation and returns the current Rovo page context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in React consumers that need starter content to follow in-app navigation.',
		],
		keywords: ['rovo', 'conversation starters', 'hook', 'page context'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'usePromptCards',
		description: 'Returns the prompt cards and prompt-library loading state available to the user.',
		status: 'general-availability',
		usageGuidelines: ['Use when composing a custom Rovo prompt-library surface.'],
		keywords: ['rovo', 'prompts', 'cards', 'hook'],
		category: 'rovo',
		returns: {
			type: '{ promptCards: PromptCard[] }',
		},
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useRovoConversationStarters',
		description: 'Selects Rovo conversation starters for the current page and product context.',
		status: 'general-availability',
		usageGuidelines: ['Use when a Rovo chat surface needs contextual starter prompts.'],
		keywords: ['rovo', 'conversation starters', 'context', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useRovoConversationStarters>',
		},
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useWindowLocation',
		description: 'Tracks browser history navigation and returns the full URL or pathname.',
		status: 'general-availability',
		usageGuidelines: [
			'Use pathname mode when query and hash changes should not affect the consumer.',
		],
		keywords: ['rovo', 'browser', 'location', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [],
	},
	{
		name: 'useRovoExperienceAPIStore',
		description:
			'Returns Rovo experience state together with orchestration and availability actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in components that both render current Rovo experience state and dispatch transitions.',
		],
		keywords: ['rovo', 'experience', 'store', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-experience-api',
		examples: [],
	},
	{
		name: 'useRovoExperienceAPIStoreActions',
		description:
			'Returns only the Rovo experience store actions without subscribing to state changes.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a component dispatches experience changes but does not render store state.',
		],
		keywords: ['rovo', 'experience', 'store actions', 'hook'],
		category: 'rovo',
		package: '@atlassian/rovo-experience-api',
		examples: [],
	},
	{
		name: 'useForYouNavigation',
		description: 'Returns the combined Rovo For You navigation state and actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a component needs both the current For You view and navigation actions.',
		],
		keywords: ['rovo', 'for you', 'navigation', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ForYouNavigation',
		},
		package: '@atlassian/rovo-for-you',
		examples: [],
	},
	{
		name: 'useForYouNavigationActions',
		description: 'Returns actions for changing Rovo For You navigation state.',
		status: 'general-availability',
		usageGuidelines: ['Use within ForYouNavigationProvider to navigate between For You views.'],
		keywords: ['rovo', 'for you', 'navigation', 'actions'],
		category: 'rovo',
		returns: {
			type: 'ForYouNavigationActions',
		},
		package: '@atlassian/rovo-for-you',
		examples: [],
	},
	{
		name: 'useForYouNavigationState',
		description: 'Reads the current Rovo For You navigation state.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within ForYouNavigationProvider when rendering the active internal view.',
		],
		keywords: ['rovo', 'for you', 'navigation', 'state'],
		category: 'rovo',
		returns: {
			type: 'ForYouNavigationState',
		},
		package: '@atlassian/rovo-for-you',
		examples: [],
	},
	{
		name: 'useFireInsightCardClicked',
		description:
			'Returns portable analytics for Rovo Insight card clicks outside the feed lifecycle.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for Insight cards opened from external surfaces such as a home carousel.',
		],
		keywords: ['rovo', 'insights', 'card', 'analytics'],
		category: 'rovo',
		returns: {
			type: '{ fireInsightCardClicked: (insightCategory: string) => void }',
		},
		package: '@atlassian/rovo-growth-pulse',
		examples: [],
	},
	{
		name: 'useInsightsAnalyticsState',
		description:
			'Tracks Rovo Insights feed views, dwell qualification, clicks, links, and retries.',
		status: 'general-availability',
		usageGuidelines: [
			'Use with an Insights feed whose view and interaction lifecycle requires unified AI analytics.',
		],
		keywords: ['rovo', 'insights', 'analytics', 'dwell'],
		category: 'rovo',
		returns: {
			type: 'UseInsightsAnalyticsStateReturn',
		},
		package: '@atlassian/rovo-growth-pulse',
		examples: [],
	},
	{
		name: 'useInsightsFeed',
		description: 'Loads and maps Rovo Insights data into feed-ready state.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when composing a custom surface from the standard Insights feed data lifecycle.',
		],
		keywords: ['rovo', 'insights', 'feed', 'data'],
		category: 'rovo',
		returns: {
			type: 'UseInsightsFeedResult',
		},
		package: '@atlassian/rovo-growth-pulse',
		examples: [],
	},
	{
		name: 'useInsightsStatus',
		description: 'Loads the current availability and freshness status for Rovo Insights.',
		status: 'general-availability',
		usageGuidelines: [
			'Use before presenting Insights UI that depends on backend availability or freshness.',
		],
		keywords: ['rovo', 'insights', 'status', 'availability'],
		category: 'rovo',
		returns: {
			type: 'UseInsightsStatusResult',
		},
		package: '@atlassian/rovo-growth-pulse',
		examples: [],
	},
	{
		name: 'useReportInsightsBannerResolved',
		description: 'Resolves banner visibility and reports the decision once per mount.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when rendering an Insights banner so shown and hidden outcomes are observable.',
		],
		keywords: ['rovo', 'insights', 'banner', 'analytics'],
		category: 'rovo',
		returns: {
			type: 'InsightsBannerResolution',
		},
		package: '@atlassian/rovo-growth-pulse',
		examples: [],
	},
	{
		name: 'usePersonalityGreeting',
		description:
			'Selects a rotating Rovo greeting and illustration for the current personality mode.',
		status: 'general-availability',
		usageGuidelines: ['Use when a Rovo surface needs a mode-aware personalized greeting.'],
		keywords: ['rovo', 'personality', 'greeting', 'hook'],
		category: 'rovo',
		returns: {
			type: 'UsePersonalityGreetingResult',
		},
		package: '@atlassian/rovo-personalization',
		examples: [],
	},
	{
		name: 'usePersonalityThinkingVerb',
		description: 'Selects a localized thinking verb that matches the active Rovo response tone.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in progress messaging that should reflect the configured Rovo personality.',
		],
		keywords: ['rovo', 'personality', 'thinking', 'hook'],
		category: 'rovo',
		returns: {
			type: 'UsePersonalityThinkingVerbResult',
		},
		package: '@atlassian/rovo-personalization',
		examples: [],
	},
	{
		name: 'useInfiniteScroll',
		description:
			'Coordinates loading more inline-browse results when a scroll sentinel enters view.',
		status: 'general-availability',
		usageGuidelines: [
			'Call useInfiniteScroll only from a React component or another custom hook.',
			'Keep the hook inputs stable where the returned behavior depends on identity or lifecycle.',
		],
		keywords: ['rovo', 'infinite-scroll', 'pagination'],
		category: 'navigation',
		returns: {
			type: 'UseInfiniteScrollResult',
		},
		package: '@atlassian/rovo-platform-ui-components',
		examples: [],
	},
	{
		name: 'useProfileTrigger',
		description:
			'Returns the profile-trigger renderer provided by the nearest ProfileTriggerProvider.',
		status: 'general-availability',
		usageGuidelines: [
			'Call useProfileTrigger only from a React component or another custom hook.',
			'Keep the hook inputs stable where the returned behavior depends on identity or lifecycle.',
		],
		keywords: ['rovo', 'profile', 'trigger'],
		category: 'rovo',
		returns: {
			type: 'ProfileTriggerRenderer | undefined',
		},
		package: '@atlassian/rovo-platform-ui-components',
		examples: [],
	},
	{
		name: 'useIsRovoSettingsModalProviderMounted',
		description: 'Reports whether a Rovo settings modal provider is mounted above the caller.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to avoid rendering controls that require an unavailable settings provider.',
		],
		keywords: ['rovo', 'settings', 'provider', 'hook'],
		category: 'rovo',
		returns: {
			type: 'boolean',
		},
		package: '@atlassian/rovo-settings-modal',
		examples: [],
	},
	{
		name: 'useRovoSettingsConfig',
		description: 'Reads the configuration supplied for the current Rovo settings experience.',
		status: 'general-availability',
		usageGuidelines: [
			'Use below RovoSettingsConfigProvider to access host-specific settings configuration.',
		],
		keywords: ['rovo', 'settings', 'config', 'hook'],
		category: 'rovo',
		returns: {
			type: 'RovoSettingsConfig',
		},
		package: '@atlassian/rovo-settings-modal',
		examples: [],
	},
	{
		name: 'useRovoSettingsModal',
		description: 'Returns controls for opening and closing the nearest Rovo settings modal.',
		status: 'general-availability',
		usageGuidelines: ['Use within RovoSettingsModalProvider to trigger settings from product UI.'],
		keywords: ['rovo', 'settings', 'modal', 'hook'],
		category: 'rovo',
		returns: {
			type: '{ open: (options?: RovoSettingsModalOpenOptions) => void; close: () => void }',
		},
		package: '@atlassian/rovo-settings-modal',
		examples: [],
	},
	{
		name: 'useAddSpaceSource',
		description: 'Adds a source to a space and mirrors the successful result into the space store.',
		status: 'general-availability',
		usageGuidelines: ['Use when a React surface lets people attach a source to a space.'],
		keywords: ['rovo', 'spaces', 'source', 'mutation'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useAddSpaceSource>',
		},
		package: '@atlassian/rovo-spaces',
		examples: [],
	},
	{
		name: 'useCreateSpace',
		description: 'Creates a Rovo space and exposes mutation, submission, and error state.',
		status: 'general-availability',
		usageGuidelines: ['Use to connect a custom creation interface to the space service.'],
		keywords: ['rovo', 'spaces', 'create', 'mutation'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useCreateSpace>',
		},
		package: '@atlassian/rovo-spaces',
		examples: [],
	},
	{
		name: 'useDeleteSpace',
		description: 'Deletes a space with optimistic store removal and rollback on failure.',
		status: 'general-availability',
		usageGuidelines: ['Use to connect a deletion confirmation flow to the space service.'],
		keywords: ['rovo', 'spaces', 'delete', 'mutation'],
		category: 'rovo',
		returns: {
			type: '{ deleteSpace: (spaceId: string) => Promise<void> }',
		},
		package: '@atlassian/rovo-spaces',
		examples: [],
	},
	{
		name: 'useDeleteSpaceSource',
		description: 'Removes a source from a space and mirrors the deletion into the space store.',
		status: 'general-availability',
		usageGuidelines: ['Use when a React surface lets people detach a source from a space.'],
		keywords: ['rovo', 'spaces', 'source', 'delete'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useDeleteSpaceSource>',
		},
		package: '@atlassian/rovo-spaces',
		examples: [],
	},
	{
		name: 'useSpaceSourcePlugins',
		description: 'Creates the Link Picker plugins used to select supported space sources.',
		status: 'general-availability',
		usageGuidelines: ['Use to configure a space source Link Picker for the current cloud.'],
		keywords: ['rovo', 'spaces', 'source', 'link picker'],
		category: 'rovo',
		returns: {
			type: 'LinkPickerPlugin[]',
		},
		package: '@atlassian/rovo-spaces',
		examples: [],
	},
	{
		name: 'useActionInvocationStatuses',
		description: 'Returns live action-invocation statuses for a set of Rovo plan steps.',
		status: 'general-availability',
		usageGuidelines: [
			'Pass a memoized invocation ID array to keep the result referentially stable.',
		],
		keywords: ['rovo', 'modal', 'action', 'status'],
		category: 'rovo',
		returns: {
			type: "Record<string, MessageActionInvocationStatus | 'idle'>",
		},
		package: '@atlassian/rovodal-context',
		examples: [],
	},
	{
		name: 'useRovodal',
		description: 'Returns one keyed Rovodal entry and actions bound to that entry.',
		status: 'general-availability',
		usageGuidelines: ['Prefer this keyed hook when a consumer owns one Rovodal key.'],
		keywords: ['rovo', 'modal', 'store', 'actions'],
		category: 'rovo',
		returns: {
			type: '[RovodalEntry<TState> | undefined, RovodalKeyedActions<TState>]',
		},
		package: '@atlassian/rovodal-context',
		examples: [],
	},
	{
		name: 'useRovodalActions',
		description: 'Returns actions bound to the global Rovodal store.',
		status: 'general-availability',
		usageGuidelines: ['Use when one component must coordinate several Rovodal keys.'],
		keywords: ['rovo', 'modal', 'store', 'global actions'],
		category: 'rovo',
		returns: {
			type: 'BoundActions<RovodalStoreState, RovodalActions>',
		},
		package: '@atlassian/rovodal-context',
		examples: [],
	},
	{
		name: 'useRovodalStoreState',
		description: 'Returns the complete global map of keyed Rovodal entries.',
		status: 'general-availability',
		usageGuidelines: ['Prefer useRovodal unless the consumer must observe several keys.'],
		keywords: ['rovo', 'modal', 'store', 'state'],
		category: 'rovo',
		returns: {
			type: 'RovodalStoreState',
		},
		package: '@atlassian/rovodal-context',
		examples: [],
	},
	{
		name: 'useRovoProjectCreationCategories',
		description: 'Returns localized feedback categories for Rovo project creation.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to keep project-creation feedback categories consistent across entry points.',
		],
		keywords: ['rovo', 'project creation', 'feedback', 'categories'],
		category: 'rovo',
		returns: {
			type: 'Category[]',
		},
		package: '@atlassian/smart-create-feedback',
		examples: [],
	},
	{
		name: 'useCurrentDisplayMessage',
		description: 'Returns the assistant message currently selected by preview history.',
		status: 'general-availability',
		usageGuidelines: ['Use when a preview must follow the current undo or redo position.'],
		keywords: ['rovo', 'smart creation', 'message', 'history'],
		category: 'rovo',
		returns: {
			type: 'StoreAssistant | undefined',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useIframeHandshake',
		description: 'Tracks the Smart Creation preview iframe handshake and timeout experience.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when composing a custom preview iframe with the package bridge protocol.',
		],
		keywords: ['rovo', 'smart creation', 'iframe', 'handshake'],
		category: 'rovo',
		returns: {
			type: 'void',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useLastAssistantMessageAuthLink',
		description: 'Extracts the outbound authentication link from the latest assistant message.',
		status: 'general-availability',
		usageGuidelines: ['Use when Smart Creation must surface a connected-app authentication step.'],
		keywords: ['rovo', 'smart creation', 'authentication', 'link'],
		category: 'rovo',
		returns: {
			type: 'string | null',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useLatestActionMessage',
		description: 'Returns the latest Smart Creation action messages and preview statuses.',
		status: 'general-availability',
		usageGuidelines: ['Use to derive current create, update, and ask-question action state.'],
		keywords: ['rovo', 'smart creation', 'action', 'message'],
		category: 'rovo',
		returns: {
			type: 'SelectedPreview',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useSelectedPreview',
		description: 'Returns the message, content, title, and status selected for preview.',
		status: 'general-availability',
		usageGuidelines: ['Use when a staging area follows the user-selected creation action.'],
		keywords: ['rovo', 'smart creation', 'selected preview', 'message'],
		category: 'rovo',
		returns: {
			type: '{ selectedPreviewMessage: StoreAssistant | undefined; selectedPreviewContentId: string | undefined; selectedPreviewTitle: string | undefined; status: PreviewStatus | undefined }',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useStagingAreaContext',
		description: 'Returns the current Smart Creation staging-area context.',
		status: 'general-availability',
		usageGuidelines: ['Call inside StagingAreaContextProvider-backed components.'],
		keywords: ['rovo', 'smart creation', 'staging area', 'context'],
		category: 'rovo',
		returns: {
			type: 'StagingAreaContext',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useUndoRedoHistory',
		description: 'Builds undo and redo navigation from ephemeral creation-action messages.',
		status: 'general-availability',
		usageGuidelines: ['Use when a preview supports navigating previous generated versions.'],
		keywords: ['rovo', 'smart creation', 'undo', 'redo'],
		category: 'rovo',
		returns: {
			type: '{ controls: UndoRedoControls | undefined; cacheUrl: (messageId: string, url: string) => void; resolveDisplayUrl: (latestEmbedUrl: string | undefined) => string | undefined }',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useBrowseAgentView',
		description: 'Returns controls for opening and closing nested views in the Rovo agent browser.',
		status: 'general-availability',
		usageGuidelines: [
			'Use within BrowseAgentView to open agent, template, or other nested detail content.',
		],
		keywords: ['rovo', 'agent', 'browse', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ReturnType<typeof useBrowseAgentView>',
		},
		package: '@atlassian/studio-browse-kit',
		examples: [],
	},
];

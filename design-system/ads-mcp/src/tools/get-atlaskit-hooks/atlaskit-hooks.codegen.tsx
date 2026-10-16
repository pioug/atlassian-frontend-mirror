/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content hooks from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::3a2fe9a9152f31ebddcf3fa6102ec30b>>
 * @codegenCommand afm workspace @af/ads-ai-tooling codegen
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
			"import React, { type FC, type MouseEvent, useCallback } from 'react';\nimport AnalyticsListener from '../src/components/AnalyticsListener';\nimport type UIAnalyticsEvent from '../src/events/UIAnalyticsEvent';\nimport withAnalyticsEvents, {\n\ttype WithAnalyticsEventsProps,\n} from '../src/hocs/withAnalyticsEvents';\nimport { useAnalyticsEvents } from '../src/hooks/useAnalyticsEvents';\nimport { useCallbackWithAnalytics } from '../src/hooks/useCallbackWithAnalytics';\nimport { usePlatformLeafEventHandler } from '../src/hooks/usePlatformLeafEventHandler';\ninterface Props extends WithAnalyticsEventsProps {\n\tchildren: React.ReactNode;\n\tonClick: (e: MouseEvent<HTMLButtonElement>) => void;\n}\nconst ButtonBase = ({ createAnalyticsEvent, onClick, ...rest }: Props) => {\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent!({\n\t\t\t\taction: 'click',\n\t\t\t});\n\t\t\t// Fire our analytics event on the 'atlaskit' channel\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...rest} onClick={handleClick} />;\n};\nconst Button = withAnalyticsEvents()(ButtonBase);\nconst ButtonUsingHook: FC<Props> = ({ onClick, ...props }) => {\n\t// Decompose function from the hook\n\tconst { createAnalyticsEvent } = useAnalyticsEvents();\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent({ action: 'click' });\n\t\t\t// Fire our analytics event\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingCallback: FC<Props> = ({ onClick, ...props }) => {\n\tconst handleClick = useCallbackWithAnalytics(onClick, { action: 'click' }, 'atlaskit');\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingEventHandlerHook = ({\n\tonClick,\n\tchildren,\n}: {\n\tchildren: React.ReactNode;\n\tonClick: (\n\t\tmouseEvent: React.MouseEvent<HTMLButtonElement>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => void;\n}) => {\n\tconst handleClick = usePlatformLeafEventHandler({\n\t\tfn: onClick,\n\t\taction: 'clicked',\n\t\tcomponentName: 'fancy-button',\n\t\tpackageName: '@atlaskit/fancy-button',\n\t\tpackageVersion: '0.1.0',\n\t});\n\treturn <button onClick={handleClick}>{children}</button>;\n};\nconst App: FC = () => {\n\tconst handleEvent = (analyticsEvent: UIAnalyticsEvent) => {\n\t\tconst { payload, context } = analyticsEvent;\n\t\tconsole.log('Received event:', { payload, context });\n\t};\n\tconst onClickHandler = () => console.log('onClickCallback');\n\treturn (\n\t\t<AnalyticsListener channel=\"atlaskit\" onEvent={handleEvent}>\n\t\t\t<Button onClick={onClickHandler}>Click me (withAnalyticsEvents)</Button>\n\t\t\t<br />\n\t\t\t<ButtonUsingHook onClick={onClickHandler}>Click me (useAnalyticsEvents)</ButtonUsingHook>\n\t\t\t<br />\n\t\t\t<ButtonUsingCallback onClick={onClickHandler}>\n\t\t\t\tClick me (useCallbackWithAnalytics)\n\t\t\t</ButtonUsingCallback>\n\t\t\t<br />\n\t\t\t<ButtonUsingEventHandlerHook onClick={onClickHandler}>\n\t\t\t\tClick me (usePlatformLeafEventHandler)\n\t\t\t</ButtonUsingEventHandlerHook>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default App;",
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
			"import React, { useCallback } from 'react';\nimport Button from '@atlaskit/button/default/button';\nimport { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';\nimport {\n\tResolvedClient,\n\tResolvedClientUrl,\n} from '@atlaskit/link-test-helpers/smart-card/mocks/clients';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Card } from '../../src';\nimport { CardAction } from '../../src/constants';\nimport { useSmartLinkActions } from '../../src/hooks';\nimport ExampleContainer from './example-container';\nconst PreviewButton = ({ url }: { url: string }) => {\n\tconst actions = useSmartLinkActions({ url, appearance: 'block' });\n\t// actions are returned in an array, find the preview action\n\tconst previewAction = actions.find((action) => action.id === 'preview-content');\n\tconst handleClick = useCallback(() => {\n\t\tif (previewAction) {\n\t\t\tpreviewAction.invoke();\n\t\t}\n\t}, [previewAction]);\n\tif (!previewAction) {\n\t\treturn null;\n\t}\n\treturn <Button onClick={handleClick}>{previewAction.text}</Button>;\n};\nconst UseSmartLinkActionsExample = (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<SmartCardProvider client={new ResolvedClient()}>\n\t\t\t<Card\n\t\t\t\tappearance=\"block\"\n\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\tactionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}\n\t\t\t/>\n\t\t\t<Box paddingBlockStart=\"space.200\">\n\t\t\t\t<PreviewButton url={ResolvedClientUrl} />\n\t\t\t</Box>\n\t\t</SmartCardProvider>\n\t</ExampleContainer>\n);\nexport default UseSmartLinkActionsExample;",
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
			"import AnalyticsContext from '@atlaskit/analytics-next/AnalyticsContext';\nimport AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';\nimport type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';\nimport { cssMap } from '@atlaskit/css';\nimport Heading from '@atlaskit/heading/heading';\nimport { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';\nimport {\n\tResolvedClient,\n\tResolvedClientUrl,\n} from '@atlaskit/link-test-helpers/smart-card/mocks/clients';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { token } from '@atlaskit/tokens';\nimport { Card } from '../../src';\nconst styles = cssMap({\n\theading: { marginBottom: token('space.100') },\n\tstack: { marginTop: token('space.100') },\n});\ntype ExampleComponentProps = {\n\tsetRecentEvents: React.Dispatch<React.SetStateAction<UIAnalyticsEvent[]>>;\n};\nconst ExampleComponent = ({ setRecentEvents }: ExampleComponentProps): JSX.Element => {\n\tconst handleOnClick = React.useCallback(\n\t\t(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {\n\t\t\te.preventDefault();\n\t\t\treturn;\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<AnalyticsListener\n\t\t\tonEvent={(event) => {\n\t\t\t\tsetRecentEvents((prevEvents) => [...prevEvents, event]);\n\t\t\t}}\n\t\t\tchannel=\"*\"\n\t\t>\n\t\t\t<AnalyticsContext\n\t\t\t\tdata={{\n\t\t\t\t\tsource: 'content',\n\t\t\t\t\tattributes: {\n\t\t\t\t\t\tdisplayCategory: 'link',\n\t\t\t\t\t\tdisplay: 'url',\n\t\t\t\t\t\tid: '123',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t<SmartCardProvider client={new ResolvedClient('dev')}>\n\t\t\t\t\t<Card\n\t\t\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\t\t\tappearance=\"inline\"\n\t\t\t\t\t\tplatform=\"web\"\n\t\t\t\t\t\tshowHoverPreview={true}\n\t\t\t\t\t\tonClick={handleOnClick}\n\t\t\t\t\t/>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</AnalyticsContext>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default (): React.JSX.Element => {\n\tconst [recentEvents, setRecentEvents] = React.useState<UIAnalyticsEvent[]>([]);\n\tconst mostRecent10Events = React.useMemo(() => {\n\t\treturn Array.from({ length: 10 }, (_, i) => {\n\t\t\treturn recentEvents.at(recentEvents.length - i - 1);\n\t\t});\n\t}, [recentEvents]);\n\treturn (\n\t\t<Box>\n\t\t\t<Box xcss={styles.heading}>\n\t\t\t\t<Heading size=\"medium\">Interact with the link below and see events being fired</Heading>\n\t\t\t</Box>\n\t\t\t<ExampleComponent setRecentEvents={setRecentEvents} />\n\t\t\t<Box xcss={styles.stack}>\n\t\t\t\t<Heading size=\"small\">The 10 Most Recent Events Fired</Heading>\n\t\t\t\t<ol>\n\t\t\t\t\t{mostRecent10Events.map((event, index) => {\n\t\t\t\t\t\tif (event === undefined) {\n\t\t\t\t\t\t\treturn <li key={index}></li>;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst { action, actionSubject, eventType } = event.payload;\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<li key={index}>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\tkey={index}\n\t\t\t\t\t\t\t\t>{`actionSubject: ${actionSubject}, action: ${action}, eventType: ${eventType}`}</Text>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t);\n\t\t\t\t\t})}\n\t\t\t\t</ol>\n\t\t\t</Box>\n\t\t</Box>\n\t);\n};",
		],
	},
	{
		name: 'useAgentSessions',
		description:
			'Reads normalized account-scoped Rovo agent sessions and keeps the Relay result current after lifecycle events.',
		status: 'general-availability',
		usageGuidelines: [
			'Read inside AgentSessionsScopeProvider and AgentSessionsDataProvider under the host Relay environment. Pass identity only to the scope provider.',
			'Render from the ready result and preserve backend session state for product-owned presentation rather than inventing replacement labels.',
			'Use the exported types entrypoint for AgentSessionsScope, AgentSessionsResult, and normalized session contracts.',
		],
		keywords: ['rovo', 'agent sessions', 'relay', 'hooks'],
		category: 'data',
		parameters: [],
		returns: {
			type: 'AgentSessionsResult',
			description:
				'An unavailable result when identity cannot resolve a Rovo workspace, otherwise normalized sessions, pagination, and refetch controls.',
		},
		package: '@atlassian/agent-sessions',
		examples: [],
	},
	{
		name: 'useChooseObjectExample',
		description: 'Returns object-example selection state for smart-creation prompts.',
		status: 'release-candidate',
		usageGuidelines: [
			'Pass the selected example key and the same examples map used to render the cards. The returned handler inserts that example’s prompt into the editor; it does not submit the prompt.',
		],
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
		status: 'release-candidate',
		usageGuidelines: [
			'Use this hook in the refreshed chat input and pass the active agent and conversation ID from the same chat. It returns no agent when agent selection is disabled or no agent is selected.',
		],
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
		status: 'release-candidate',
		usageGuidelines: [
			'Use this hook when you build your own prompt-library filters. Pass the current prompt cards, render `filteredPromptCards`, and connect the search and filter controls to the returned handlers.',
		],
		keywords: ['rovo', 'prompt library', 'filter', 'hook'],
		category: 'rovo',
		returns: {
			type: 'UsePromptLibraryFiltersResult',
		},
		package: '@atlassian/conversation-assistant',
		examples: [],
	},
	{
		name: 'useAutoSuggest',
		description: 'Fetches and manages streaming prompt suggestions for a Rovo Chat query.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when a host needs to compose its own suggestion presentation while retaining the package request and cancellation behavior.',
		],
		keywords: ['rovo', 'chat', 'suggestions', 'hook'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-auto-suggest',
		examples: [],
	},
	{
		name: 'useAutoSuggestTracking',
		description: 'Provides tracking state for auto-suggest interactions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use with the host analytics lifecycle when tracking suggestion impressions or selections.',
		],
		keywords: ['rovo', 'chat', 'suggestions', 'tracking'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-auto-suggest',
		examples: [],
	},
	{
		name: 'useAllAttachmentsStore',
		description:
			'Selects all file and external-context attachments for one prompt-input key and exposes attachment actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Pass the same stable prompt-input key to this selector and its add, update, and remove actions so attachments stay with the right draft.',
			'Render the returned file and external-context items in order when the composer presents them as one attachment list.',
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
			'Keep the providers and callbacks in the prompt flow that owns the selected context. Use `currentContexts` when building the prompt and render `currentBrowser` with the menu returned by `getMenuItems`.',
		],
		keywords: ['rovo', 'chat', 'context', 'browser', 'hook'],
		category: 'rovo',
		returns: {
			type: 'ExternalContextBrowserState',
			description:
				'Returns the current browser, selected contexts, and menu-item builder for the supplied context browser configuration.',
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
		name: 'useConversationAssistantSpotlightActions',
		description:
			'Public hook `useConversationAssistantSpotlightActions` from `@atlassian/conversation-assistant-onboarding/controllers/spotlight`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-onboarding',
		examples: [],
	},
	{
		name: 'useConversationAssistantSpotlightState',
		description:
			'Public hook `useConversationAssistantSpotlightState` from `@atlassian/conversation-assistant-onboarding/controllers/spotlight`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-onboarding',
		examples: [],
	},
	{
		name: 'useGettingStartedTourState',
		description:
			'Public hook `useGettingStartedTourState` from `@atlassian/conversation-assistant-onboarding/controllers/getting-started-tour`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-onboarding',
		examples: [],
	},
	{
		name: 'useGettingStartedTourStore',
		description:
			'Public hook `useGettingStartedTourStore` from `@atlassian/conversation-assistant-onboarding/controllers/getting-started-tour`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-onboarding',
		examples: [],
	},
	{
		name: 'useGettingStartedTourStoreActions',
		description:
			'Public hook `useGettingStartedTourStoreActions` from `@atlassian/conversation-assistant-onboarding/controllers/getting-started-tour`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-onboarding',
		examples: [],
	},
	{
		name: 'usePostOfficeCoordination',
		description:
			'Public hook `usePostOfficeCoordination` from `@atlassian/conversation-assistant-onboarding/controllers/post-office-migration`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-onboarding',
		examples: [],
	},
	{
		name: 'useProductData',
		description:
			'Public useProductData entrypoint for @atlassian/conversation-assistant-preview-card.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the public useProductData entrypoint when integrating this Rovo capability.',
		],
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-preview-card',
		examples: [],
	},
	{
		name: 'useTemplateContextProvider',
		description:
			'Public use-template-context-provider entrypoint for @atlassian/conversation-assistant-template-selector.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the public use-template-context-provider entrypoint when integrating this Rovo capability.',
		],
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-template-selector',
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
		name: 'useChartApiService',
		description:
			'Public hook `useChartApiService` from `@atlassian/conversation-assistant-viz/services/chart-api-service`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/conversation-assistant-viz',
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
			'Treat the returned state as the last successfully loaded or saved preference. A failed update leaves it unchanged.',
			'Show a save error with a retry option when an update fails.',
		],
		keywords: ['rovo', 'creation', 'auto apply', 'state'],
		category: 'rovo',
		package: '@atlassian/creation-settings',
		examples: [],
	},
	{
		name: 'useEditorRovoBridge',
		description:
			'Connects an editor instance to Rovo command handling, streaming lifecycle, and media insertion.',
		status: 'general-availability',
		usageGuidelines: [
			'Use from the editor integration that owns the current EditorView and Rovo content bridge session.',
		],
		keywords: ['rovo', 'editor', 'streaming', 'bridge'],
		category: 'rovo',
		package: '@atlassian/editor-rovo-bridge',
		examples: [],
	},
	{
		name: 'useGuardFlagContent',
		description: 'Builds localized Guard flag content for a supported product surface.',
		status: 'general-availability',
		usageGuidelines: ['Pass the real Guard surface so copy matches the policy context.'],
		keywords: ['rovo chat', 'guard', 'flag'],
		category: 'rovo',
		package: '@atlassian/guard-redaction-ui',
		examples: [],
	},
	{
		name: 'useAiCreateProjectContext',
		description: 'Resolves Jira project context for an AI-assisted creation flow.',
		status: 'general-availability',
		usageGuidelines: [
			'Render within the app Relay provider. Pass the project fragment, Jira actions, and messageId for this group of drafts.',
			'Wait for isStoreReady before reading the initialized drafts. Wait for isHydrationDone before treating user-picker values as fully loaded.',
		],
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
		usageGuidelines: [
			'Pass the messageId for the AI-assisted creation flow. The hook adds it to each analytics event; the analytics integration supplies the conversation context.',
			'Add attributes specific to the event without repeating the message or conversation IDs.',
		],
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
		usageGuidelines: [
			'Pass the messageId used for this group of drafts. The hook returns false before initialization and ignores dismissed drafts when checking whether all items were created.',
			'Handle the submission result separately: this value describes draft state and does not prove that a non-empty creation request succeeded.',
		],
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
		usageGuidelines: [
			'Pass the messageId for the draft group being shown; the hook returns false before initialization and becomes true only when every stored draft is dismissed.',
			'Keep the empty-state decision separate if a message can start with no drafts, so “nothing to dismiss” is not described as “dismissed”.',
		],
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
		usageGuidelines: [
			'Pass the latest reviewed drafts to the returned callback when the person submits. It checks required fields and removes fields not recognized by the project configuration.',
			'Handle onSuccess and onError to update the app. Awaiting the callback is not enough to confirm success; validation and creation failures are reported through those handlers.',
		],
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
		usageGuidelines: [
			'Call after creation succeeds. Pass the created Jira issue keys and site URL so View and Copy point to the right site.',
			'Show creation failures separately from this success notice.',
		],
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
		usageGuidelines: [
			'Read draft records from the draft-work-items store. This hook supplies update handlers; use the same messageId when reading and changing the drafts.',
			'Use onFieldChange for edits, removeWorkItem for one draft, and onDismissAllDraftWorkItems for the group. Pass cloudId and conversationId to save edits to the conversation.',
		],
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
		usageGuidelines: [
			'Pass the same messageId as the draft list to count records for that message.',
			'Use useGetDraftWorkItemsToCreate to find the items that can still be created; this count includes other draft states.',
		],
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
		usageGuidelines: [
			'Use the map to show which children are still planned beneath each parent; a missing parent key means there are no planned children to report.',
			'This map includes planned child invocation IDs only, so do not use it as the full child count or as a signal that creation has finished.',
		],
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
		usageGuidelines: [
			'Read this immediately before submission so edits, dismissals, completed items, and parent-child relationships are current.',
			'Submit each returned parent with its childWorkItems; do not flatten the tree or add nested children to the top-level payload a second time.',
		],
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
		usageGuidelines: [
			'Render the returned top-level drafts and their childWorkItems as a tree; do not also render the children as separate top-level rows.',
			'Use the same messageId for the draft editor and its updates so the hierarchy reflects the current message rather than another conversation response.',
		],
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
		usageGuidelines: [
			'Use this flag for the message to preserve or label edits when new suggestions arrive.',
			'Track edits to all fields, not just changes to the visible summary.',
		],
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
		usageGuidelines: [
			'Use once within the configured content-bridge client, passing its clientId and setupHandler. The hook connects the app to Rovo and disconnects on unmount or page exit.',
			'Let this hook manage setup and cleanup instead of calling ready or teardown separately.',
		],
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
		usageGuidelines: [
			'Validate the current draft list before enabling creation; a result with success false contains a user-facing validation error, while undefined means project field configuration was unavailable.',
			'Use the returned validated drafts for submission, since the hook removes fields that are not part of the selected Jira issue-type configuration.',
		],
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
		name: 'useFiltersState',
		description:
			'Initializes and maintains connector-specific search filter state from resource type, hydrated connector configuration, and URL query parameters.',
		status: 'general-availability',
		usageGuidelines: [
			'Render within IntlProvider because connector configuration includes localized filter state.',
			'Wait for hasInitialisedState before issuing a connector search from filtersState.',
		],
		keywords: ['rovo', 'agents', 'connectors', 'filters', 'search'],
		category: 'rovo',
		package: '@atlassian/rovo-agent-connectors',
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
		name: 'useRovoConfig',
		description:
			'Fetches the combined Rovo configuration, including accessible products, connector state, and OAuth update support.',
		status: 'early-access',
		usageGuidelines: [
			'Use in a Rovo host with a cloud ID and render loading or error states before using connector data.',
			'Call onOAuthSuccess only after the host confirms a connector OAuth flow has succeeded.',
		],
		keywords: ['rovo', 'connectors', 'configuration', 'oauth', 'search'],
		category: 'agents',
		package: '@atlassian/rovo-connectors-config',
		examples: [],
	},
	{
		name: 'useRovoConfigStore',
		description:
			'Provides the conversation-assistant-compatible connector store while Rovo Chat migrates to canonical connector configuration.',
		status: 'early-access',
		usageGuidelines: [
			'Use only as a 1:1 migration boundary for existing conversation-assistant connector selectors.',
			'Do not persist or mutate returned connector records directly; use markUserConnected after a confirmed OAuth flow.',
		],
		keywords: ['rovo', 'chat', 'connectors', 'store', 'oauth'],
		category: 'agents',
		package: '@atlassian/rovo-connectors-config',
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
		name: 'useCaseOptions',
		description:
			'Public hook `useCaseOptions` from `@atlassian/rovo-conversation-actions/prompt-cards`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [
			"import React, { useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport type { PromptCard } from '@atlassian/rovo-conversation-actions/prompt-cards';\nimport { PromptCardsGrid } from '@atlassian/rovo-conversation-actions/prompt-cards-grid';\nconst cards: PromptCard[] = [\n\t{\n\t\tid: 'draft-release-notes',\n\t\ttitle: 'Draft release notes',\n\t\tprompt: 'Draft customer-ready release notes from this week’s completed work.',\n\t\tuseCase: 'Create',\n\t},\n\t{\n\t\tid: 'review-project-risks',\n\t\ttitle: 'Review project risks',\n\t\tprompt: 'Identify risks, owners, and mitigations for this project update.',\n\t\tuseCase: 'Review',\n\t},\n];\nexport default function PromptLibraryGridExample(): React.JSX.Element {\n\tconst [selectedPrompt, setSelectedPrompt] = useState<string>();\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<Stack space=\"space.150\">\n\t\t\t\t<PromptCardsGrid cards={cards} onCardClick={(card) => setSelectedPrompt(card.title)} />\n\t\t\t\t{selectedPrompt ? <Text>Selected: {selectedPrompt}</Text> : null}\n\t\t\t</Stack>\n\t\t</IntlProvider>\n\t);\n}",
		],
	},
	{
		name: 'useConversationActionsStore',
		description: 'Reads selected Rovo conversation-action store state and actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use this combined hook only when the component both reads and updates the action store; use the state-only or actions-only hook when it needs just one side.',
			'A store update can rerender this component, so keep it close to the controls that need the state rather than high in the chat tree.',
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
			'Use for components that only dispatch store updates so they do not subscribe to every action-state change.',
			'Use the conversation-assistant setActiveAction flow for active-action changes; do not call setActiveAction_UNSAFE from a new consumer.',
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
			'Use to read store values without updating them. Make changes through the actions hook or an app event handler.',
			'Use a selector for a single value when possible so unrelated store changes do not rerender the component.',
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
		description:
			'Public hook `usePromptCards` from `@atlassian/rovo-conversation-actions/prompt-cards`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/rovo-conversation-actions',
		examples: [
			"import React, { useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport type { PromptCard } from '@atlassian/rovo-conversation-actions/prompt-cards';\nimport { PromptCardsGrid } from '@atlassian/rovo-conversation-actions/prompt-cards-grid';\nconst cards: PromptCard[] = [\n\t{\n\t\tid: 'draft-release-notes',\n\t\ttitle: 'Draft release notes',\n\t\tprompt: 'Draft customer-ready release notes from this week’s completed work.',\n\t\tuseCase: 'Create',\n\t},\n\t{\n\t\tid: 'review-project-risks',\n\t\ttitle: 'Review project risks',\n\t\tprompt: 'Identify risks, owners, and mitigations for this project update.',\n\t\tuseCase: 'Review',\n\t},\n];\nexport default function PromptLibraryGridExample(): React.JSX.Element {\n\tconst [selectedPrompt, setSelectedPrompt] = useState<string>();\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<Stack space=\"space.150\">\n\t\t\t\t<PromptCardsGrid cards={cards} onCardClick={(card) => setSelectedPrompt(card.title)} />\n\t\t\t\t{selectedPrompt ? <Text>Selected: {selectedPrompt}</Text> : null}\n\t\t\t</Stack>\n\t\t</IntlProvider>\n\t);\n}",
		],
	},
	{
		name: 'usePromptCards',
		description: 'Returns the prompt cards and prompt-library loading state available to the user.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to arrange the built-in prompt cards in your own layout, or pass the cards to PromptCardsGrid for the standard grid.',
			'Provide the skill metadata for the current site before rendering; it determines which skill cards are available.',
		],
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
		usageGuidelines: [
			'Pass the current product and page details to choose relevant starters. Supply dynamicStartersConfig and assistanceServiceParams when the app supports fetched suggestions.',
			'Show loading while suggestions are fetched. Choose whether selection fills the prompt editor or submits the prompt.',
		],
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
			'Use pathname mode to follow page routes only. The default follows the whole URL, including query strings and fragments.',
			'Use WindowLocationContext in tests or embedded views that should follow an app-supplied location instead of the browser URL.',
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
		name: 'useFomoCollaborators',
		description: 'Public use-fomo-collaborators entrypoint for @atlassian/rovo-fomo-nudge.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the public use-fomo-collaborators entrypoint when integrating this Rovo capability.',
		],
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/rovo-fomo-nudge',
		examples: [],
	},
	{
		name: 'useFomoCollaboratorsBatched',
		description: 'Public use-fomo-collaborators-batched entrypoint for @atlassian/rovo-fomo-nudge.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the public use-fomo-collaborators-batched entrypoint when integrating this Rovo capability.',
		],
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/rovo-fomo-nudge',
		examples: [],
	},
	{
		name: 'useFomoCollaboratorsByAaid',
		description: 'Public use-fomo-collaborators-by-aaid entrypoint for @atlassian/rovo-fomo-nudge.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the public use-fomo-collaborators-by-aaid entrypoint when integrating this Rovo capability.',
		],
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/rovo-fomo-nudge',
		examples: [],
	},
	{
		name: 'useForYouNavigation',
		description: 'Returns the combined Rovo For You navigation state and actions.',
		status: 'general-availability',
		usageGuidelines: [],
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
		description:
			'Returns the reset action for Rovo For You navigation. The action is currently a no-op because only the threads-list view exists.',
		status: 'general-availability',
		usageGuidelines: [],
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
		usageGuidelines: [],
		keywords: ['rovo', 'for you', 'navigation', 'state'],
		category: 'rovo',
		returns: {
			type: 'ForYouNavigationState',
		},
		package: '@atlassian/rovo-for-you',
		examples: [
			"import { Box } from '@atlaskit/primitives/compiled/box';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport {\n\tForYouNavigationProvider,\n\tuseForYouNavigationState,\n} from '@atlassian/rovo-for-you/navigation-store';\nexport default function ForYouNavigationProviderExample(): React.JSX.Element {\n\treturn (\n\t\t<ForYouNavigationProvider>\n\t\t\t<CurrentForYouView />\n\t\t</ForYouNavigationProvider>\n\t);\n}\nfunction CurrentForYouView(): React.JSX.Element {\n\tconst { currentView } = useForYouNavigationState();\n\treturn (\n\t\t<Box padding=\"space.200\">\n\t\t\t<Text>Current view: {currentView.type}</Text>\n\t\t</Box>\n\t);\n}",
		],
	},
	{
		name: 'useFireInsightCardClicked',
		description:
			'Returns portable analytics for Rovo Insight card clicks outside the feed lifecycle.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to record clicks on insight cards outside InsightsFeed, such as a home carousel. Record the click only once when the feed already handles it.',
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
			'Use to build a custom feed instead of InsightsFeed. Handle loading, errors, and retries, and navigate from the app when an insight is selected.',
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
			'Enable the request only on pages where Insights are available. Check availability and freshness before showing a link that requires recent content; missing or invalid generation dates count as stale.',
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
			'Pass the same visibility values used to decide whether the banner is shown. The hook reports the outcome once per mount; use one instance for that banner.',
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
		name: 'usePinnedItems',
		description: 'Public hook `usePinnedItems` from `@atlassian/rovo-pins/store`.',
		status: 'general-availability',
		keywords: ['rovo', 'chat', 'ai', 'platform'],
		category: 'rovo',
		package: '@atlassian/rovo-pins',
		examples: [
			"/**\n * Example: PinnedWorkSection with pinned items.\n *\n * Demos the \"Your team's work\" heading, \"+\" button, and item list shown once at least one\n * epic, project, or goal is pinned. See `01-pinned-work-section.tsx` for the empty-state\n * demo shown before anything is pinned. The last row has a deliberately long title —\n * hovering it shows a tooltip with the full text once it overflows.\n */\nimport React, { useEffect } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport { cssMap } from '@atlaskit/css';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { token } from '@atlaskit/tokens';\nimport { usePinnedItems } from '../src/services/pinned-items-store';\nimport type { SearchWorkItem } from '../src/types';\nimport { PinnedWorkSection } from '../src/ui/pinned-work-section/PinnedWorkSection';\nconst EXAMPLE_CLOUD_ID = 'example-cloud-id';\nconst EXAMPLE_PRODUCT = 'jira';\nconst MOCK_ITEMS: SearchWorkItem[] = [\n\t{\n\t\tari: 'ari:cloud:jira:site/1:epic/1',\n\t\turl: 'https://example.atlassian.net/browse/EPIC-1',\n\t\tpinType: 'JiraIssue',\n\t\tname: 'Your Work tab: Pin objects',\n\t},\n\t{\n\t\tari: 'ari:cloud:jira:site/1:project/1',\n\t\turl: 'https://example.atlassian.net/jira/projects/1',\n\t\tpinType: 'AtlasProject',\n\t\tname: 'Rovo For You',\n\t},\n\t{\n\t\tari: 'ari:cloud:jira:site/1:goal/1',\n\t\turl: 'https://example.atlassian.net/goals/1',\n\t\tpinType: 'AtlasGoal',\n\t\tname: 'Grow Rovo weekly active users',\n\t},\n\t{\n\t\tari: 'ari:cloud:jira:site/1:epic/2',\n\t\turl: 'https://example.atlassian.net/browse/EPIC-2',\n\t\tpinType: 'JiraIssue',\n\t\tname: 'A deliberately very long epic title used to demo single-line overflow clipping',\n\t},\n];\nconst styles = cssMap({\n\twrapper: {\n\t\twidth: '360px',\n\t\tpaddingTop: token('space.300'),\n\t\tpaddingRight: token('space.200'),\n\t\tpaddingBottom: token('space.300'),\n\t\tpaddingLeft: token('space.200'),\n\t},\n});\n/**\n * Pins the mock items once on mount via the real `pin()` action, then renders its children.\n * `usePinnedItems` now calls the real create endpoint, so this demo only shows the populated\n * state when previewed against a live backend for `EXAMPLE_CLOUD_ID` — same `cloudId` as\n * `PinnedWorkSection` below, so both share the same `useQuery` cache entry.\n */\nconst PinMockItemsOnMount = ({ children }: { children: React.ReactNode }): React.JSX.Element => {\n\tconst { pin } = usePinnedItems({ cloudId: EXAMPLE_CLOUD_ID, product: EXAMPLE_PRODUCT });\n\tuseEffect(() => {\n\t\t// pin() prepends each item, so pin in reverse to render top-to-bottom in\n\t\t// MOCK_ITEMS' declared order — matching 02-pinned-item-row.tsx.\n\t\t[...MOCK_ITEMS].reverse().forEach((item) => {\n\t\t\tpin(item);\n\t\t});\n\t\t// Intentionally run once on mount only — MOCK_ITEMS is a static, module-level constant.\n\t}, []);\n\treturn <>{children}</>;\n};\nexport default function PinnedWorkSectionWithItemsExample(): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<PinMockItemsOnMount>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<PinnedWorkSection\n\t\t\t\t\t\tcloudId={EXAMPLE_CLOUD_ID}\n\t\t\t\t\t\tproduct={EXAMPLE_PRODUCT}\n\t\t\t\t\t\tonPinWorkClick={() => {}}\n\t\t\t\t\t\tonStartChat={() => {}}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t</PinMockItemsOnMount>\n\t\t</IntlProvider>\n\t);\n}",
		],
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
		name: 'usePromptOfTheDay',
		description:
			'Reads today’s account-scoped prompt suggestions with a shared request cache and an explicit availability status.',
		status: 'general-availability',
		usageGuidelines: [
			'Render no prompt UI when status is unavailable; an empty result intentionally covers skipped, failed, and malformed responses.',
			'Pass the same account and request arguments across surfaces to reuse the cache entry.',
		],
		keywords: ['rovo', 'prompt of the day', 'suggestions', 'cache'],
		category: 'rovo',
		package: '@atlassian/rovo-prompt-of-the-day',
		examples: [],
	},
	{
		name: 'usePromptOfTheDayWithFallback',
		description:
			'Reads the same shared suggestions, keeps showing the last stored ones while new ones load or if that request fails, and can remove a used suggestion.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when an empty surface is worse than yesterday’s suggestions; status is stale when a refresh failed.',
			'maxAgeMs can only keep an entry past its expiry; a value shorter than the time left to expiry has no effect.',
			'Call removePrompt once a suggestion is used, so no surface offers it again before the entry regenerates.',
		],
		keywords: ['rovo', 'prompt of the day', 'suggestions', 'cache', 'fallback', 'stale'],
		category: 'rovo',
		package: '@atlassian/rovo-prompt-of-the-day',
		examples: [],
	},
	{
		name: 'useIsRovoSettingsModalProviderMounted',
		description: 'Reports whether a Rovo settings modal provider is mounted above the caller.',
		status: 'general-availability',
		usageGuidelines: [
			'Check this before showing controls that require RovoSettingsModalProvider. It reports whether the component is within that provider.',
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
			'Read the product, site, and settings configuration from the nearest provider. RovoSettingsModalProvider supplies these values for the standard settings flow.',
		],
		keywords: ['rovo', 'settings', 'config', 'hook'],
		category: 'rovo',
		returns: {
			type: 'RovoSettingsConfig',
		},
		package: '@atlassian/rovo-settings-modal',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport {\n\tRovoSettingsConfigProvider,\n\tuseIsRovoSettingsModalProviderMounted,\n\tuseRovoSettingsConfig,\n} from '@atlassian/rovo-settings-modal/common/utils/rovo-settings-config';\nconst SettingsContextSummary = (): React.JSX.Element => {\n\tconst { product, siteId, experienceId } = useRovoSettingsConfig();\n\tconst isModalProviderMounted = useIsRovoSettingsModalProviderMounted();\n\treturn (\n\t\t<Stack space=\"space.050\">\n\t\t\t<Text>Product: {product}</Text>\n\t\t\t<Text>Site: {siteId}</Text>\n\t\t\t<Text>Experience: {experienceId}</Text>\n\t\t\t<Text>Settings modal provider mounted: {isModalProviderMounted ? 'yes' : 'no'}</Text>\n\t\t</Stack>\n\t);\n};\nexport default function RovoSettingsConfigExample(): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<RovoSettingsConfigProvider\n\t\t\t\tvalue={{\n\t\t\t\t\tproduct: 'confluence',\n\t\t\t\t\tsiteId: 'example-cloud-id',\n\t\t\t\t\texperienceId: 'ai-mate',\n\t\t\t\t\tsurface: 'profile-menu',\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t<SettingsContextSummary />\n\t\t\t</RovoSettingsConfigProvider>\n\t\t</IntlProvider>\n\t);\n}",
		],
	},
	{
		name: 'useRovoSettingsModal',
		description: 'Returns controls for opening and closing the nearest Rovo settings modal.',
		status: 'general-availability',
		usageGuidelines: [
			'Call this hook within RovoSettingsModalProvider. Use RovoSettingsModal when your app has no provider and only needs a trigger to open settings.',
		],
		keywords: ['rovo', 'settings', 'modal', 'hook'],
		category: 'rovo',
		returns: {
			type: '{ open: (options?: RovoSettingsModalOpenOptions) => void; close: () => void }',
		},
		package: '@atlassian/rovo-settings-modal',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport Button from '@atlaskit/button/default/button';\nimport {\n\tRovoSettingsModalProvider,\n\tuseRovoSettingsModal,\n} from '@atlassian/rovo-settings-modal/ui/rovo-settings-modal-provider';\ntype RovoSettingsModalProviderExampleProps = {\n\tcloudId: string;\n};\nconst SettingsAction = (): React.JSX.Element => {\n\tconst { open } = useRovoSettingsModal();\n\treturn (\n\t\t<Button appearance=\"subtle\" onClick={() => open({ defaultTab: 'connected-apps' })}>\n\t\t\tManage connected apps\n\t\t</Button>\n\t);\n};\nexport default function RovoSettingsModalProviderExample({\n\tcloudId,\n}: RovoSettingsModalProviderExampleProps): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<RovoSettingsModalProvider product=\"confluence\" cloudId={cloudId}>\n\t\t\t\t<SettingsAction />\n\t\t\t</RovoSettingsModalProvider>\n\t\t</IntlProvider>\n\t);\n}",
		],
	},
	{
		name: 'useAddSpaceSource',
		description: 'Adds a source to a space and mirrors the successful result into the space store.',
		status: 'general-availability',
		usageGuidelines: [
			'Call addSource with the resolved source URL and any available name, ARI, and type. The hook updates the space store on success; use its error and isAdding state to keep the picker feedback in sync.',
		],
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
		usageGuidelines: [
			'Pass the current cloud, product, and experience values. Call mutate when the form submits.',
			'Set form loading and errors from isSubmitting and error. Update navigation from onSuccess after creation.',
		],
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
		usageGuidelines: [
			'Call deleteSpace only after the person confirms deletion. The hook removes the space optimistically and restores it if the request fails, so keep the error visible and let the person retry.',
		],
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
		usageGuidelines: [
			'Call deleteSource with the source ID after confirmation. The hook updates the space store on success and rejects on failure; use isDeleting and error to prevent duplicate submits and report failures.',
		],
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
		usageGuidelines: [
			'Build the picker plugins with the cloud ID from the active site, then pass them into the authenticated Link Picker context. The hook supplies Confluence, Jira, Atlas, and Loom sources.',
		],
		keywords: ['rovo', 'spaces', 'source', 'link picker'],
		category: 'rovo',
		returns: {
			type: 'LinkPickerPlugin[]',
		},
		package: '@atlassian/rovo-spaces',
		examples: [
			"import React, { useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport Button from '@atlaskit/button/default/button';\nimport { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { SourceLinkPickerPopup } from '@atlassian/rovo-spaces/ui/SpaceLandingPage/SourceLinkPickerPopup';\nimport type { SpaceSource } from '@atlassian/rovo-spaces/ui/SpaceLandingPage/types';\nimport { useSpaceSourcePlugins } from '@atlassian/rovo-spaces/ui/SpaceLandingPage/useSpaceSourcePlugins';\ntype SourceLinkPickerPopupExampleProps = {\n\t/** Cloud ID from the host's authenticated Link Picker integration context. */\n\tcloudId: string;\n\t/** Persist this source and then pass the updated source list back to the picker. */\n\tonPersistSource: (source: SpaceSource) => Promise<void>;\n};\nexport default function SourceLinkPickerPopupExample({\n\tcloudId,\n\tonPersistSource,\n}: SourceLinkPickerPopupExampleProps): React.JSX.Element {\n\tconst plugins = useSpaceSourcePlugins(cloudId);\n\tconst [sources, setSources] = useState<SpaceSource[]>([]);\n\tconst [message, setMessage] = useState<string>();\n\tconst handleSourceAdded = (source: SpaceSource) => {\n\t\t// The picker resolves a link; the host owns authorization and persistence.\n\t\tvoid onPersistSource(source).then(\n\t\t\t() => setSources((current) => [...current, source]),\n\t\t\t() => setMessage(`Could not add ${source.title}`),\n\t\t);\n\t};\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<SmartCardProvider>\n\t\t\t\t<Stack space=\"space.150\">\n\t\t\t\t\t<SourceLinkPickerPopup\n\t\t\t\t\t\tcloudId={cloudId}\n\t\t\t\t\t\tplugins={plugins}\n\t\t\t\t\t\tsources={sources}\n\t\t\t\t\t\tonSourceAdded={handleSourceAdded}\n\t\t\t\t\t\ttrigger={({ onClick, ...triggerProps }) => (\n\t\t\t\t\t\t\t<Button {...triggerProps} onClick={onClick}>\n\t\t\t\t\t\t\t\tAdd a source\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t)}\n\t\t\t\t\t/>\n\t\t\t\t\t{sources.map((source) => (\n\t\t\t\t\t\t<Text key={source.id} size=\"small\">\n\t\t\t\t\t\t\t{source.title}\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t))}\n\t\t\t\t\t{message && (\n\t\t\t\t\t\t<Text size=\"small\" role=\"status\">\n\t\t\t\t\t\t\t{message}\n\t\t\t\t\t\t</Text>\n\t\t\t\t\t)}\n\t\t\t\t</Stack>\n\t\t\t</SmartCardProvider>\n\t\t</IntlProvider>\n\t);\n}",
		],
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
		name: 'useRetry',
		description: 'Retries an asynchronous readiness check until it succeeds, fails, or is stopped.',
		status: 'general-availability',
		usageGuidelines: [
			'Use a stable async callback and provide a bounded retry count for transient session checks.',
		],
		keywords: ['rovodev', 'retry', 'session', 'hooks'],
		category: 'agents',
		package: '@atlassian/rovodev-session-frame',
		examples: [],
	},
	{
		name: 'useSandboxReadiness',
		description: 'Polls Relay for Rovo Dev sandbox readiness, progress, and known sandbox errors.',
		status: 'general-availability',
		usageGuidelines: [
			'Use from a Relay-enabled session surface and show the returned progress or error state to the user.',
		],
		keywords: ['rovodev', 'sandbox', 'relay', 'readiness', 'hooks'],
		category: 'agents',
		package: '@atlassian/rovodev-session-frame',
		examples: [],
	},
	{
		name: 'useWakeUpSession',
		description:
			'Returns a callback that asks the Rovo Dev backend to keep a session sandbox awake.',
		status: 'general-availability',
		usageGuidelines: [
			'Invoke from a Relay-enabled host only when a user action needs to wake an existing session.',
		],
		keywords: ['rovodev', 'session', 'sandbox', 'relay', 'hooks'],
		category: 'agents',
		package: '@atlassian/rovodev-session-frame',
		examples: [],
	},
	{
		name: 'useGetRovoDevAutomationSettings',
		description:
			'Returns an async reader, cache state, loading state, and error state for a container’s Rovo Dev automation setting.',
		status: 'general-availability',
		usageGuidelines: [
			'Call the returned reader from a host-owned effect or user action and render its loading and error states.',
			'Treat a missing server setting as the documented disabled default rather than assuming automation is enabled.',
		],
		keywords: ['rovodev', 'automation', 'settings', 'container'],
		category: 'agents',
		package: '@atlassian/rovodev-settings',
		examples: [],
	},
	{
		name: 'useSetRovoDevAutomationSettings',
		description:
			'Returns an async writer with loading and error state for a container’s Rovo Dev automation setting.',
		status: 'general-availability',
		usageGuidelines: [
			'Persist an automation toggle only after explicit user confirmation and surface a failed write in the host UI.',
		],
		keywords: ['rovodev', 'automation', 'settings', 'container'],
		category: 'agents',
		package: '@atlassian/rovodev-settings',
		examples: [],
	},
	{
		name: 'useRovodevIframe',
		description: 'Returns readiness state and command helpers for the Rovo Dev session iframe.',
		status: 'general-availability',
		usageGuidelines: [
			'Use only in the browser surface that owns the Rovo Dev iframe identified by ROVODEV_IFRAME_SELECTOR.',
			'Wait for isIframeReady and handle rejected command promises when the iframe is unavailable or times out.',
		],
		keywords: ['rovodev', 'iframe', 'vscode', 'commands'],
		category: 'agents',
		package: '@atlassian/rovodev-use-rovodev-iframe',
		examples: [],
	},
	{
		name: 'useRovoProjectCreationCategories',
		description: 'Returns localized feedback categories for Rovo project creation.',
		status: 'general-availability',
		usageGuidelines: [
			'Use to show the same translated project-creation categories as SmartCreateFeedback.',
			'Display the translated labels and save the stable category IDs with feedback.',
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
		usageGuidelines: [
			'Use this message when rendering the preview after undo or redo; it follows the message selected in the staging-area history rather than always returning the newest message.',
		],
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
		usageGuidelines: [
			'Use this for the latest create or update action and ask-question state. It reads the active conversation, so provide the product’s Smart Creation chat-store hook for that conversation.',
		],
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
		usageGuidelines: [
			'Use this when the preview should follow the action the person selected, including a specific action within a message. Provide the active conversation’s chat-store hook so the selected message can be resolved.',
		],
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
		usageGuidelines: [
			'Call within StagingAreaContextProvider. Read the selected preview and status from the current conversation instead of keeping another copy in component state.',
		],
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
		usageGuidelines: [
			'Enable history only for previews that can be revisited, and cache each message’s embed URL as it loads. The hook returns controls only when there is more than one supported generated version.',
		],
		keywords: ['rovo', 'smart creation', 'undo', 'redo'],
		category: 'rovo',
		returns: {
			type: '{ controls: UndoRedoControls | undefined; cacheUrl: (messageId: string, url: string) => void; resolveDisplayUrl: (latestEmbedUrl: string | undefined) => string | undefined }',
		},
		package: '@atlassian/smart-creation',
		examples: [],
	},
	{
		name: 'useRovoPanel',
		description: 'Returns the current Store Rovo panel mode and controls.',
		status: 'general-availability',
		usageGuidelines: [
			'Call beneath RovoPanelProvider; use mode instead of duplicating panel-open state.',
		],
		keywords: ['rovo', 'store', 'panel'],
		category: 'rovo',
		package: '@atlassian/store-rovo',
		examples: [],
	},
	{
		name: 'useStoreRovoContext',
		description: 'Returns Store context and setters used to enrich a Rovo conversation.',
		status: 'general-availability',
		usageGuidelines: [
			'Call beneath StoreRovoContextProvider and clear route-specific context when leaving a Store surface.',
		],
		keywords: ['rovo', 'store', 'context'],
		category: 'rovo',
		package: '@atlassian/store-rovo',
		examples: [],
	},
	{
		name: 'useBrowseAgentCategoryUpdates',
		description:
			'Public hook `useBrowseAgentCategoryUpdates` exported by `@atlassian/studio-agent-browse/ui/browse-agent/useBrowseAgentCategoryUpdates`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-browse',
		examples: [],
	},
	{
		name: 'useBrowseAgentView',
		description:
			'Public hook `useBrowseAgentView` exported by `@atlassian/studio-agent-browse/browse-agent/use-browse-agent-view`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-browse',
		examples: [],
	},
	{
		name: 'useAgentKnowledgeSourcesMutation',
		description:
			'Public hook `useAgentKnowledgeSourcesMutation` exported by `@atlassian/studio-agent-editor/domains/knowledge-sources/mutations`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useAgentSkillsMutation',
		description:
			'Public hook `useAgentSkillsMutation` exported by `@atlassian/studio-agent-editor/domains/skills/mutations`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useAgentToolConfigurationMutation',
		description:
			'Public hook `useAgentToolConfigurationMutation` exported by `@atlassian/studio-agent-editor/domains/tools/mutations`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useAgentToolsMutation',
		description:
			'Public hook `useAgentToolsMutation` exported by `@atlassian/studio-agent-editor/domains/tools/mutations`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useKnowledgeSourcesUpdater',
		description:
			'Public hook `useKnowledgeSourcesUpdater` exported by `@atlassian/studio-agent-editor/domains/knowledge-sources/updaters`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useScenarioToolsMutation',
		description:
			'Public hook `useScenarioToolsMutation` exported by `@atlassian/studio-agent-editor/domains/tools/mutations`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useSkillsUpdater',
		description:
			'Public hook `useSkillsUpdater` exported by `@atlassian/studio-agent-editor/domains/skills/updaters`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useToolConfigurationUpdater',
		description:
			'Public hook `useToolConfigurationUpdater` exported by `@atlassian/studio-agent-editor/domains/tools/updaters`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useToolsUpdater',
		description:
			'Public hook `useToolsUpdater` exported by `@atlassian/studio-agent-editor/domains/tools/updaters`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useUpdateAgentDetailsMutation',
		description:
			'Public hook `useUpdateAgentDetailsMutation` exported by `@atlassian/studio-agent-editor/domains/agent-details/mutations`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-editor',
		examples: [],
	},
	{
		name: 'useAgentProfileViewNavigation',
		description:
			'Public hook `useAgentProfileViewNavigation` exported by `@atlassian/studio-agent-profile/ui/agent-profile/components/AgentProfileViewNavigationProvider`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-profile',
		examples: [],
	},
	{
		name: 'useAvailableConfigsByTier',
		description:
			'Public hook `useAvailableConfigsByTier` exported by `@atlassian/studio-agent-profile/agent-reasoning/use-available-configs-by-tier`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-profile',
		examples: [],
	},
	{
		name: 'useVisibleExecutionTierOptions',
		description:
			'Public hook `useVisibleExecutionTierOptions` exported by `@atlassian/studio-agent-profile/agent-reasoning/use-visible-execution-tier-options`.',
		status: 'general-availability',
		usageGuidelines: [
			'Import from this explicit public entrypoint rather than a source-internal path.',
			'Keep host lifecycle, permissions, and network orchestration at the integration boundary.',
		],
		keywords: ['studio', 'rovo', 'agent'],
		category: 'studio',
		package: '@atlassian/studio-agent-profile',
		examples: [],
	},
];

/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content hooks from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::fef352249d4955ee39f3c228cea0cbee>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen:atlaskit-hooks
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
			"import React, { type FC, type MouseEvent, useCallback } from 'react';\nimport {\n\tAnalyticsListener,\n\ttype UIAnalyticsEvent,\n\tuseAnalyticsEvents,\n\tuseCallbackWithAnalytics,\n\tusePlatformLeafEventHandler,\n\twithAnalyticsEvents,\n\ttype WithAnalyticsEventsProps,\n} from '../src';\ninterface Props extends WithAnalyticsEventsProps {\n\tchildren: React.ReactNode;\n\tonClick: (e: MouseEvent<HTMLButtonElement>) => void;\n}\nconst ButtonBase = ({ createAnalyticsEvent, onClick, ...rest }: Props) => {\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent!({\n\t\t\t\taction: 'click',\n\t\t\t});\n\t\t\t// Fire our analytics event on the 'atlaskit' channel\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...rest} onClick={handleClick} />;\n};\nconst Button = withAnalyticsEvents()(ButtonBase);\nconst ButtonUsingHook: FC<Props> = ({ onClick, ...props }) => {\n\t// Decompose function from the hook\n\tconst { createAnalyticsEvent } = useAnalyticsEvents();\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent({ action: 'click' });\n\t\t\t// Fire our analytics event\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingCallback: FC<Props> = ({ onClick, ...props }) => {\n\tconst handleClick = useCallbackWithAnalytics(onClick, { action: 'click' }, 'atlaskit');\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingEventHandlerHook = ({\n\tonClick,\n\tchildren,\n}: {\n\tchildren: React.ReactNode;\n\tonClick: (\n\t\tmouseEvent: React.MouseEvent<HTMLButtonElement>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => void;\n}) => {\n\tconst handleClick = usePlatformLeafEventHandler({\n\t\tfn: onClick,\n\t\taction: 'clicked',\n\t\tcomponentName: 'fancy-button',\n\t\tpackageName: '@atlaskit/fancy-button',\n\t\tpackageVersion: '0.1.0',\n\t});\n\treturn <button onClick={handleClick}>{children}</button>;\n};\nconst App: FC = () => {\n\tconst handleEvent = (analyticsEvent: UIAnalyticsEvent) => {\n\t\tconst { payload, context } = analyticsEvent;\n\t\tconsole.log('Received event:', { payload, context });\n\t};\n\tconst onClickHandler = () => console.log('onClickCallback');\n\treturn (\n\t\t<AnalyticsListener channel=\"atlaskit\" onEvent={handleEvent}>\n\t\t\t<Button onClick={onClickHandler}>Click me (withAnalyticsEvents)</Button>\n\t\t\t<br />\n\t\t\t<ButtonUsingHook onClick={onClickHandler}>Click me (useAnalyticsEvents)</ButtonUsingHook>\n\t\t\t<br />\n\t\t\t<ButtonUsingCallback onClick={onClickHandler}>\n\t\t\t\tClick me (useCallbackWithAnalytics)\n\t\t\t</ButtonUsingCallback>\n\t\t\t<br />\n\t\t\t<ButtonUsingEventHandlerHook onClick={onClickHandler}>\n\t\t\t\tClick me (usePlatformLeafEventHandler)\n\t\t\t</ButtonUsingEventHandlerHook>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default App;",
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
			"import React, { useCallback } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport { Card } from '../../src';\nimport { CardAction } from '../../src/constants';\nimport { useSmartLinkActions } from '../../src/hooks';\nimport ExampleContainer from './example-container';\nconst PreviewButton = ({ url }: { url: string }) => {\n\tconst actions = useSmartLinkActions({ url, appearance: 'block' });\n\t// actions are returned in an array, find the preview action\n\tconst previewAction = actions.find((action) => action.id === 'preview-content');\n\tconst handleClick = useCallback(() => {\n\t\tif (previewAction) {\n\t\t\tpreviewAction.invoke();\n\t\t}\n\t}, [previewAction]);\n\tif (!previewAction) {\n\t\treturn null;\n\t}\n\treturn <Button onClick={handleClick}>{previewAction.text}</Button>;\n};\nconst UseSmartLinkActionsExample = (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<SmartCardProvider client={new ResolvedClient()}>\n\t\t\t<Card\n\t\t\t\tappearance=\"block\"\n\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\tactionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}\n\t\t\t/>\n\t\t\t<Box paddingBlockStart=\"space.200\">\n\t\t\t\t<PreviewButton url={ResolvedClientUrl} />\n\t\t\t</Box>\n\t\t</SmartCardProvider>\n\t</ExampleContainer>\n);\nexport default UseSmartLinkActionsExample;",
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
			"import {\n\tAnalyticsContext,\n\tAnalyticsListener,\n\ttype UIAnalyticsEvent,\n} from '@atlaskit/analytics-next';\nimport Heading from '@atlaskit/heading';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box, Text, xcss } from '@atlaskit/primitives';\nimport { Card } from '../../src';\nconst headingBoxStyles = xcss({\n\tmarginBottom: 'space.100',\n});\nconst stackBoxStyles = xcss({\n\tmarginTop: 'space.100',\n});\ntype ExampleComponentProps = {\n\tsetRecentEvents: React.Dispatch<React.SetStateAction<UIAnalyticsEvent[]>>;\n};\nconst ExampleComponent = ({ setRecentEvents }: ExampleComponentProps): JSX.Element => {\n\tconst handleOnClick = React.useCallback(\n\t\t(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {\n\t\t\te.preventDefault();\n\t\t\treturn;\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<AnalyticsListener\n\t\t\tonEvent={(event) => {\n\t\t\t\tsetRecentEvents((prevEvents) => [...prevEvents, event]);\n\t\t\t}}\n\t\t\tchannel=\"*\"\n\t\t>\n\t\t\t<AnalyticsContext\n\t\t\t\tdata={{\n\t\t\t\t\tsource: 'content',\n\t\t\t\t\tattributes: {\n\t\t\t\t\t\tdisplayCategory: 'link',\n\t\t\t\t\t\tdisplay: 'url',\n\t\t\t\t\t\tid: '123',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t<SmartCardProvider client={new ResolvedClient('dev')}>\n\t\t\t\t\t<Card\n\t\t\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\t\t\tappearance=\"inline\"\n\t\t\t\t\t\tplatform=\"web\"\n\t\t\t\t\t\tshowHoverPreview={true}\n\t\t\t\t\t\tonClick={handleOnClick}\n\t\t\t\t\t/>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</AnalyticsContext>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default (): React.JSX.Element => {\n\tconst [recentEvents, setRecentEvents] = React.useState<UIAnalyticsEvent[]>([]);\n\tconst mostRecent10Events = React.useMemo(() => {\n\t\treturn Array.from({ length: 10 }, (_, i) => {\n\t\t\treturn recentEvents.at(recentEvents.length - i - 1);\n\t\t});\n\t}, [recentEvents]);\n\treturn (\n\t\t<Box>\n\t\t\t<Box xcss={headingBoxStyles}>\n\t\t\t\t<Heading size=\"medium\">Interact with the link below and see events being fired</Heading>\n\t\t\t</Box>\n\t\t\t<ExampleComponent setRecentEvents={setRecentEvents} />\n\t\t\t<Box xcss={stackBoxStyles}>\n\t\t\t\t<Heading size=\"small\">The 10 Most Recent Events Fired</Heading>\n\t\t\t\t<ol>\n\t\t\t\t\t{mostRecent10Events.map((event, index) => {\n\t\t\t\t\t\tif (event === undefined) {\n\t\t\t\t\t\t\treturn <li key={index}></li>;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst { action, actionSubject, eventType } = event.payload;\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<li key={index}>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\tkey={index}\n\t\t\t\t\t\t\t\t>{`actionSubject: ${actionSubject}, action: ${action}, eventType: ${eventType}`}</Text>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t);\n\t\t\t\t\t})}\n\t\t\t\t</ol>\n\t\t\t</Box>\n\t\t</Box>\n\t);\n};",
		],
	},
];

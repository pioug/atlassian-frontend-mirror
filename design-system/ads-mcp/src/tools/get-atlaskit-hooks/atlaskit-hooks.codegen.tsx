/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content hooks from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::54db052ad53f695704ea4e9666a1ee4d>>
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
		name: 'useCloseOnEscapePress',
		description:
			'Calls `onClose` when the Escape key is pressed and this layer is currently on top of the layering tree. Layers covered by a deeper layer are skipped, so Escape closes the topmost surface first.',
		status: 'general-availability',
		usageGuidelines: [
			'Mount inside the component that owns the surface (modal body, popup body, drawer body). Wrap that component in `<Layering>` or it will not receive layer information.',
			'Do not pair with a second top-level Escape listener — the hook already coordinates dismissal across stacked layers.',
		],
		accessibilityGuidelines: [
			'Escape-to-close is the expected dismissal pattern for overlay surfaces (WAI-ARIA Authoring Practices). Always wire it up alongside an explicit close button.',
		],
		keywords: ['layering', 'hook', 'useCloseOnEscapePress', 'escape', 'dismiss'],
		category: 'layering',
		parameters: [
			{
				name: 'options',
				type: '{ onClose: (e: KeyboardEvent) => void; isDisabled?: boolean }',
				description:
					'`onClose` runs on the first Escape keydown per press. Set `isDisabled` to opt out without unmounting the hook (for example, when the surface is mounted but in a non-closable state).',
			},
		],
		returns: {
			type: 'void',
		},
		package: '@atlaskit/layering',
		examples: [],
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
		name: 'useLayering',
		description:
			'Returns information about the current layer in the layering tree: the layer depth, a check for whether this layer is currently disabled (i.e. not on top), and the top-most depth in the tree.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a layered surface to gate behaviour that should only run for the top-most layer (for example, registering global keyboard listeners or auto-focusing content).',
			'Prefer `useCloseOnEscapePress` for the common case of closing on Escape — only reach for `useLayering` when you need raw level info.',
		],
		keywords: ['layering', 'hook', 'useLayering', 'top-layer'],
		category: 'layering',
		parameters: [],
		returns: {
			type: '{ currentLevel: number; isLayerDisabled: () => boolean; getTopLevel: () => number | null }',
			description:
				'`currentLevel` is the depth of the calling layer. `isLayerDisabled()` returns true when a deeper layer is currently on top. `getTopLevel()` returns the deepest registered layer, or `null` if no layers are mounted.',
		},
		package: '@atlaskit/layering',
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
];

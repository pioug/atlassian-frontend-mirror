/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content hooks from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::4c9c1485dcaae7d7946943ada8224ad5>>
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
		import: {
			name: 'useDatasourceLifecycleAnalytics',
			package: '@atlaskit/link-analytics',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-analytics',
			packageJson: {
				name: '@atlaskit/link-analytics',
				version: '12.1.0',
				description:
					'Contains analytics and utils to assist in instrumenting Linking Platform components.',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: false,
				'atlaskit:src': 'src/index.ts',
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'LinkingAnalytics',
					},
				},
				scripts: {
					'codegen-analytics':
						'yarn workspace @atlassian/analytics-tooling run analytics:codegen link-analytics --output ./src/common/utils/analytics',
				},
				dependencies: {
					'@atlaskit/analytics-next': 'workspace:^',
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/link-client-extension': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@babel/runtime': 'root:*',
					lru_map: 'root:*',
					rusha: 'root:*',
				},
				peerDependencies: {
					'@atlaskit/link-provider': 'workspace:^',
					react: '^18.2.0',
				},
				devDependencies: {
					'@af/analytics-codegen': 'workspace:^',
					'@atlaskit/link-picker': 'workspace:^',
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/dom': 'root:*',
					'@testing-library/react': 'root:*',
					'@testing-library/user-event': 'root:*',
					'fetch-mock': 'root:*',
					react: 'root:*',
					'react-intl': 'root:*',
				},
				exports: {
					'.': './src/index.ts',
					'./lifecycle': './src/entry-points/lifecycle.ts',
					'./resolved-attributes': './src/entry-points/resolved-attributes.ts',
				},
				'platform-feature-flags': {
					'platform_bandicoots-smartlink-unresolved-error-key': {
						type: 'boolean',
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/ee279202-f1b9-4a9d-a894-92f79e2a98db',
			},
		},
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
		import: {
			name: 'useSmartLinkLifecycleAnalytics',
			package: '@atlaskit/link-analytics',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-analytics',
			packageJson: {
				name: '@atlaskit/link-analytics',
				version: '12.1.0',
				description:
					'Contains analytics and utils to assist in instrumenting Linking Platform components.',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: false,
				'atlaskit:src': 'src/index.ts',
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'LinkingAnalytics',
					},
				},
				scripts: {
					'codegen-analytics':
						'yarn workspace @atlassian/analytics-tooling run analytics:codegen link-analytics --output ./src/common/utils/analytics',
				},
				dependencies: {
					'@atlaskit/analytics-next': 'workspace:^',
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/link-client-extension': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@babel/runtime': 'root:*',
					lru_map: 'root:*',
					rusha: 'root:*',
				},
				peerDependencies: {
					'@atlaskit/link-provider': 'workspace:^',
					react: '^18.2.0',
				},
				devDependencies: {
					'@af/analytics-codegen': 'workspace:^',
					'@atlaskit/link-picker': 'workspace:^',
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/dom': 'root:*',
					'@testing-library/react': 'root:*',
					'@testing-library/user-event': 'root:*',
					'fetch-mock': 'root:*',
					react: 'root:*',
					'react-intl': 'root:*',
				},
				exports: {
					'.': './src/index.ts',
					'./lifecycle': './src/entry-points/lifecycle.ts',
					'./resolved-attributes': './src/entry-points/resolved-attributes.ts',
				},
				'platform-feature-flags': {
					'platform_bandicoots-smartlink-unresolved-error-key': {
						type: 'boolean',
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/ee279202-f1b9-4a9d-a894-92f79e2a98db',
			},
		},
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
		import: {
			name: 'useDatasourceClientExtension',
			package: '@atlaskit/link-client-extension',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-client-extension',
			packageJson: {
				name: '@atlaskit/link-client-extension',
				version: '7.1.0',
				description: 'Extension methods for linking platform client',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'LinkClientExtension',
					},
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: false,
				'atlaskit:src': 'src/index.ts',
				exports: {
					'.': './src/index.ts',
					'./use-smart-link-client-extension':
						'./src/entry-points/use-smart-link-client-extension.ts',
					'./use-data-source-client-extension':
						'./src/entry-points/use-data-source-client-extension.ts',
					'./use-data-source-client-extension/mocks':
						'./src/entry-points/data-source-client-extension-mocks.ts',
					'./use-data-source-client-extension/types':
						'./src/entry-points/data-source-response-types.ts',
				},
				dependencies: {
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@babel/runtime': 'root:*',
					lru_map: 'root:*',
				},
				peerDependencies: {
					'@atlaskit/link-provider': 'workspace:^',
					react: '^18.2.0',
				},
				devDependencies: {
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/react': 'root:*',
					react: 'root:*',
					'react-dom': 'root:*',
					'wait-for-expect': 'root:*',
				},
				techstack: {
					'@atlassian/frontend': {
						'code-structure': ['tangerine-next'],
						'import-structure': ['atlassian-conventions'],
						'circular-dependencies': ['file-and-folder-level'],
					},
					'@repo/internal': {
						'dom-events': 'use-bind-event-listener',
						analytics: ['analytics-next'],
						'design-tokens': ['color'],
						theming: ['react-context'],
						'ui-components': ['lite-mode'],
						deprecation: ['no-deprecated-imports'],
						styling: ['static', 'emotion'],
						imports: ['import-no-extraneous-disable-for-examples-and-docs'],
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/cf4080bb-133c-425e-bf40-17e725f5add5',
			},
		},
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
		import: {
			name: 'useSmartLinkClientExtension',
			package: '@atlaskit/link-client-extension',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-client-extension',
			packageJson: {
				name: '@atlaskit/link-client-extension',
				version: '7.1.0',
				description: 'Extension methods for linking platform client',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'LinkClientExtension',
					},
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: false,
				'atlaskit:src': 'src/index.ts',
				exports: {
					'.': './src/index.ts',
					'./use-smart-link-client-extension':
						'./src/entry-points/use-smart-link-client-extension.ts',
					'./use-data-source-client-extension':
						'./src/entry-points/use-data-source-client-extension.ts',
					'./use-data-source-client-extension/mocks':
						'./src/entry-points/data-source-client-extension-mocks.ts',
					'./use-data-source-client-extension/types':
						'./src/entry-points/data-source-response-types.ts',
				},
				dependencies: {
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@babel/runtime': 'root:*',
					lru_map: 'root:*',
				},
				peerDependencies: {
					'@atlaskit/link-provider': 'workspace:^',
					react: '^18.2.0',
				},
				devDependencies: {
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/react': 'root:*',
					react: 'root:*',
					'react-dom': 'root:*',
					'wait-for-expect': 'root:*',
				},
				techstack: {
					'@atlassian/frontend': {
						'code-structure': ['tangerine-next'],
						'import-structure': ['atlassian-conventions'],
						'circular-dependencies': ['file-and-folder-level'],
					},
					'@repo/internal': {
						'dom-events': 'use-bind-event-listener',
						analytics: ['analytics-next'],
						'design-tokens': ['color'],
						theming: ['react-context'],
						'ui-components': ['lite-mode'],
						deprecation: ['no-deprecated-imports'],
						styling: ['static', 'emotion'],
						imports: ['import-no-extraneous-disable-for-examples-and-docs'],
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/cf4080bb-133c-425e-bf40-17e725f5add5',
			},
		},
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
		import: {
			name: 'useLinkCreateCallback',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-create',
			packageJson: {
				name: '@atlaskit/link-create',
				version: '6.1.0',
				description: 'The driver component of meta creation flow',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'LinkCreate',
					},
					i18n: true,
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: ['**/*.compiled.css'],
				'atlaskit:src': 'src/index.ts',
				exports: {
					'.': './src/index.ts',
					'./i18n/*': {
						publish: null,
						default: './src/i18n/*.ts',
					},
					'./async-select': './src/entry-points/async-select.ts',
					'./callback-context': './src/entry-points/callback-context.ts',
					'./create-field': './src/entry-points/create-field.ts',
					'./create-form': './src/entry-points/create-form.ts',
					'./exit-warning-modal': './src/entry-points/exit-warning-modal.ts',
					'./final-form': './src/entry-points/final-form.ts',
					'./form-loader': './src/entry-points/form-loader.ts',
					'./form-spy': './src/entry-points/form-spy.ts',
					'./icons': './src/entry-points/icons.ts',
					'./inline-create': './src/entry-points/inline-create.ts',
					'./modal-create': './src/entry-points/modal-create.ts',
					'./select': './src/entry-points/select.ts',
					'./text-field': './src/entry-points/text-field.ts',
					'./types': './src/entry-points/types.ts',
					'./user-picker': './src/entry-points/user-picker.ts',
				},
				dependencies: {
					'@atlaskit/afm-i18n-platform-linking-platform-link-create': 'root:*',
					'@atlaskit/analytics-next': 'workspace:^',
					'@atlaskit/atlassian-context': 'workspace:^',
					'@atlaskit/button': 'workspace:^',
					'@atlaskit/css': 'workspace:^',
					'@atlaskit/empty-state': 'workspace:^',
					'@atlaskit/form': 'workspace:^',
					'@atlaskit/icon': 'workspace:^',
					'@atlaskit/icon-file-type': 'workspace:^',
					'@atlaskit/intl-messages-provider': 'workspace:^',
					'@atlaskit/link': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/modal-dialog': 'workspace:^',
					'@atlaskit/object': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/primitives': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@atlaskit/select': 'workspace:^',
					'@atlaskit/smart-user-picker': 'workspace:^',
					'@atlaskit/spinner': 'workspace:^',
					'@atlaskit/textfield': 'workspace:^',
					'@atlaskit/theme': 'workspace:^',
					'@atlaskit/tokens': 'workspace:^',
					'@babel/runtime': 'root:*',
					'@compiled/react': 'root:*',
					'debounce-promise': 'root:*',
					'final-form': 'root:*',
					'react-final-form': 'root:*',
				},
				peerDependencies: {
					react: '^18.2.0',
					'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
				},
				devDependencies: {
					'@af/accessibility-testing': 'workspace:^',
					'@af/integration-testing': 'workspace:^',
					'@af/visual-regression': 'workspace:^',
					'@atlaskit/drawer': 'workspace:^',
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlaskit/popup': 'workspace:^',
					'@atlassian/a11y-jest-testing': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/react': 'root:*',
					'@testing-library/user-event': 'root:*',
					'@types/debounce-promise': 'root:*',
					'fetch-mock': 'root:*',
					react: 'root:*',
					'react-dom': 'root:*',
					'react-intl': 'root:*',
					'wait-for-expect': 'root:*',
				},
				scripts: {
					'codegen-analytics':
						"yarn run ts-analytics-codegen --command='yarn workspace @atlaskit/link-create run codegen-analytics'",
				},
				techstack: {
					'@atlassian/frontend': {
						'code-structure': ['tangerine-next'],
						'import-structure': ['atlassian-conventions'],
						'circular-dependencies': ['file-and-folder-level'],
					},
					'@repo/internal': {
						'dom-events': 'use-bind-event-listener',
						analytics: ['analytics-next'],
						theming: ['react-context', 'tokens'],
						'ui-components': ['lite-mode'],
						deprecation: ['no-deprecated-imports'],
						styling: ['static', 'compiled'],
						imports: ['import-no-extraneous-disable-for-examples-and-docs'],
					},
				},
				'platform-feature-flags': {},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/5ebc0bfb-9b6d-4ec0-adbe-e4d5e88ace44',
			},
		},
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
		import: {
			name: 'useWithExitWarning',
			package: '@atlaskit/link-create',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-create',
			packageJson: {
				name: '@atlaskit/link-create',
				version: '6.1.0',
				description: 'The driver component of meta creation flow',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'LinkCreate',
					},
					i18n: true,
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: ['**/*.compiled.css'],
				'atlaskit:src': 'src/index.ts',
				exports: {
					'.': './src/index.ts',
					'./i18n/*': {
						publish: null,
						default: './src/i18n/*.ts',
					},
					'./async-select': './src/entry-points/async-select.ts',
					'./callback-context': './src/entry-points/callback-context.ts',
					'./create-field': './src/entry-points/create-field.ts',
					'./create-form': './src/entry-points/create-form.ts',
					'./exit-warning-modal': './src/entry-points/exit-warning-modal.ts',
					'./final-form': './src/entry-points/final-form.ts',
					'./form-loader': './src/entry-points/form-loader.ts',
					'./form-spy': './src/entry-points/form-spy.ts',
					'./icons': './src/entry-points/icons.ts',
					'./inline-create': './src/entry-points/inline-create.ts',
					'./modal-create': './src/entry-points/modal-create.ts',
					'./select': './src/entry-points/select.ts',
					'./text-field': './src/entry-points/text-field.ts',
					'./types': './src/entry-points/types.ts',
					'./user-picker': './src/entry-points/user-picker.ts',
				},
				dependencies: {
					'@atlaskit/afm-i18n-platform-linking-platform-link-create': 'root:*',
					'@atlaskit/analytics-next': 'workspace:^',
					'@atlaskit/atlassian-context': 'workspace:^',
					'@atlaskit/button': 'workspace:^',
					'@atlaskit/css': 'workspace:^',
					'@atlaskit/empty-state': 'workspace:^',
					'@atlaskit/form': 'workspace:^',
					'@atlaskit/icon': 'workspace:^',
					'@atlaskit/icon-file-type': 'workspace:^',
					'@atlaskit/intl-messages-provider': 'workspace:^',
					'@atlaskit/link': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/modal-dialog': 'workspace:^',
					'@atlaskit/object': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/primitives': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@atlaskit/select': 'workspace:^',
					'@atlaskit/smart-user-picker': 'workspace:^',
					'@atlaskit/spinner': 'workspace:^',
					'@atlaskit/textfield': 'workspace:^',
					'@atlaskit/theme': 'workspace:^',
					'@atlaskit/tokens': 'workspace:^',
					'@babel/runtime': 'root:*',
					'@compiled/react': 'root:*',
					'debounce-promise': 'root:*',
					'final-form': 'root:*',
					'react-final-form': 'root:*',
				},
				peerDependencies: {
					react: '^18.2.0',
					'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
				},
				devDependencies: {
					'@af/accessibility-testing': 'workspace:^',
					'@af/integration-testing': 'workspace:^',
					'@af/visual-regression': 'workspace:^',
					'@atlaskit/drawer': 'workspace:^',
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlaskit/popup': 'workspace:^',
					'@atlassian/a11y-jest-testing': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/react': 'root:*',
					'@testing-library/user-event': 'root:*',
					'@types/debounce-promise': 'root:*',
					'fetch-mock': 'root:*',
					react: 'root:*',
					'react-dom': 'root:*',
					'react-intl': 'root:*',
					'wait-for-expect': 'root:*',
				},
				scripts: {
					'codegen-analytics':
						"yarn run ts-analytics-codegen --command='yarn workspace @atlaskit/link-create run codegen-analytics'",
				},
				techstack: {
					'@atlassian/frontend': {
						'code-structure': ['tangerine-next'],
						'import-structure': ['atlassian-conventions'],
						'circular-dependencies': ['file-and-folder-level'],
					},
					'@repo/internal': {
						'dom-events': 'use-bind-event-listener',
						analytics: ['analytics-next'],
						theming: ['react-context', 'tokens'],
						'ui-components': ['lite-mode'],
						deprecation: ['no-deprecated-imports'],
						styling: ['static', 'compiled'],
						imports: ['import-no-extraneous-disable-for-examples-and-docs'],
					},
				},
				'platform-feature-flags': {},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/5ebc0bfb-9b6d-4ec0-adbe-e4d5e88ace44',
			},
		},
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
		import: {
			name: 'useSmartCardContext',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-provider',
			packageJson: {
				name: '@atlaskit/link-provider',
				version: '5.1.0',
				description:
					'Contains provider with react context for anything link related and the link http client',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					singleton: true,
					website: {
						name: 'SmartCardProvider',
					},
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: false,
				'atlaskit:src': 'src/index.ts',
				exports: {
					'.': './src/index.ts',
					'./client': './src/client/index.ts',
					'./context': './src/state/context/index.tsx',
					'./editor': './src/editor/index.ts',
					'./provider': './src/provider.tsx',
					'./responses': './src/client/types/responses.ts',
					'./types': './src/state/context/types.ts',
				},
				dependencies: {
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/link-extractors': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@babel/runtime': 'root:*',
					'async-retry': 'root:*',
					dataloader: 'root:*',
					lodash: 'root:*',
					lru_map: 'root:*',
					'p-throttle': 'root:*',
					redux: 'root:*',
				},
				peerDependencies: {
					react: '^18.2.0',
				},
				devDependencies: {
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/media-test-helpers': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/react': 'root:*',
					'@types/async-retry': 'root:*',
					'@types/redux': 'root:*',
					react: 'root:*',
					'react-dom': 'root:*',
					'wait-for-expect': 'root:*',
				},
				'platform-feature-flags': {
					platform_linking_force_no_cache_smart_card_client: {
						type: 'boolean',
					},
					'navx-smartcard-auth-event-listener-killswitch-fg': {
						type: 'boolean',
					},
					platform_smartlink_inline_resolve_optimization: {
						type: 'boolean',
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/186ef24b-75c6-4a0c-aaa3-4185737ea168',
			},
		},
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
		import: {
			name: 'useSmartLinkContext',
			package: '@atlaskit/link-provider',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/link-provider',
			packageJson: {
				name: '@atlaskit/link-provider',
				version: '5.1.0',
				description:
					'Contains provider with react context for anything link related and the link http client',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				atlassian: {
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					singleton: true,
					website: {
						name: 'SmartCardProvider',
					},
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: false,
				'atlaskit:src': 'src/index.ts',
				exports: {
					'.': './src/index.ts',
					'./client': './src/client/index.ts',
					'./context': './src/state/context/index.tsx',
					'./editor': './src/editor/index.ts',
					'./provider': './src/provider.tsx',
					'./responses': './src/client/types/responses.ts',
					'./types': './src/state/context/types.ts',
				},
				dependencies: {
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/link-extractors': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@babel/runtime': 'root:*',
					'async-retry': 'root:*',
					dataloader: 'root:*',
					lodash: 'root:*',
					lru_map: 'root:*',
					'p-throttle': 'root:*',
					redux: 'root:*',
				},
				peerDependencies: {
					react: '^18.2.0',
				},
				devDependencies: {
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/media-test-helpers': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@testing-library/react': 'root:*',
					'@types/async-retry': 'root:*',
					'@types/redux': 'root:*',
					react: 'root:*',
					'react-dom': 'root:*',
					'wait-for-expect': 'root:*',
				},
				'platform-feature-flags': {
					platform_linking_force_no_cache_smart_card_client: {
						type: 'boolean',
					},
					'navx-smartcard-auth-event-listener-killswitch-fg': {
						type: 'boolean',
					},
					platform_smartlink_inline_resolve_optimization: {
						type: 'boolean',
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/186ef24b-75c6-4a0c-aaa3-4185737ea168',
			},
		},
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
		import: {
			name: 'useSmartLinkActions',
			package: '@atlaskit/smart-card/hooks',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/smart-card',
			packageJson: {
				name: '@atlaskit/smart-card',
				version: '45.6.0',
				description: 'Smart card component',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: ['**/*.compiled.css'],
				'atlaskit:src': 'src/index.ts',
				atlassian: {
					i18n: true,
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'Smart Card',
					},
				},
				scripts: {
					'analytics:codegen':
						'yarn workspace @atlassian/analytics-tooling run analytics:codegen smart-card --output ./src/common/analytics/generated',
					'ak-postbuild': 'ls -d dist/* | xargs -n 1 copyfiles -u 1 -V src/**/*.{svg,png}',
				},
				dependencies: {
					'@atlaskit/adf-utils': 'workspace:^',
					'@atlaskit/afm-i18n-platform-linking-platform-smart-card': 'root:*',
					'@atlaskit/analytics-cross-product': 'workspace:^',
					'@atlaskit/analytics-gas-types': 'workspace:^',
					'@atlaskit/analytics-next': 'workspace:^',
					'@atlaskit/avatar': 'workspace:^',
					'@atlaskit/avatar-group': 'workspace:^',
					'@atlaskit/badge': 'workspace:^',
					'@atlaskit/browser-apis': 'workspace:^',
					'@atlaskit/button': 'workspace:^',
					'@atlaskit/checkbox': 'workspace:^',
					'@atlaskit/css': 'workspace:^',
					'@atlaskit/dropdown-menu': 'workspace:^',
					'@atlaskit/embedded-confluence': 'workspace:^',
					'@atlaskit/feature-gate-js-client': 'workspace:^',
					'@atlaskit/flag': 'workspace:^',
					'@atlaskit/form': 'workspace:^',
					'@atlaskit/frontend-utilities': 'workspace:^',
					'@atlaskit/heading': 'workspace:^',
					'@atlaskit/icon': 'workspace:^',
					'@atlaskit/icon-file-type': 'workspace:^',
					'@atlaskit/icon-lab': 'workspace:^',
					'@atlaskit/image': 'workspace:^',
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/link': 'workspace:^',
					'@atlaskit/link-analytics': 'workspace:^',
					'@atlaskit/link-client-extension': 'workspace:^',
					'@atlaskit/link-extractors': 'workspace:^',
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/logo': 'workspace:^',
					'@atlaskit/lozenge': 'workspace:^',
					'@atlaskit/menu': 'workspace:^',
					'@atlaskit/modal-dialog': 'workspace:^',
					'@atlaskit/motion': 'workspace:^',
					'@atlaskit/object': 'workspace:^',
					'@atlaskit/outbound-auth-flow-client': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/platform-feature-flags-react': 'workspace:^',
					'@atlaskit/popup': 'workspace:^',
					'@atlaskit/primitives': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@atlaskit/react-ufo': 'workspace:^',
					'@atlaskit/rovo-triggers': 'workspace:^',
					'@atlaskit/section-message': 'workspace:^',
					'@atlaskit/select': 'workspace:^',
					'@atlaskit/spinner': 'workspace:^',
					'@atlaskit/tag': 'workspace:^',
					'@atlaskit/textarea': 'workspace:^',
					'@atlaskit/textfield': 'workspace:^',
					'@atlaskit/theme': 'workspace:^',
					'@atlaskit/tile': 'workspace:^',
					'@atlaskit/tmp-editor-statsig': 'workspace:^',
					'@atlaskit/tokens': 'workspace:^',
					'@atlaskit/tooltip': 'workspace:^',
					'@atlaskit/ufo': 'workspace:^',
					'@atlaskit/width-detector': 'workspace:^',
					'@babel/runtime': 'root:*',
					'@compiled/react': 'root:*',
					'@formatjs/intl-utils': 'root:*',
					facepaint: 'root:*',
					lru_map: 'root:*',
					'markdown-to-jsx': 'root:*',
					'react-error-boundary': 'root:*',
					'react-lazily-render': 'root:*',
					'react-loadable': 'root:*',
					'react-magnetic-di': 'root:*',
					'react-render-image': 'root:*',
					'use-sync-external-store': 'root:*',
					uuid: 'root:*',
				},
				peerDependencies: {
					'@atlaskit/link-provider': 'workspace:^',
					react: '^18.2.0',
					'react-dom': '^18.2.0',
					'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
				},
				devDependencies: {
					'@af/integration-testing': 'workspace:^',
					'@af/visual-regression': 'workspace:^',
					'@atlaskit/analytics-listeners': 'workspace:^',
					'@atlaskit/css-reset': 'workspace:^',
					'@atlaskit/media-test-helpers': 'workspace:^',
					'@atlaskit/ssr': 'workspace:^',
					'@atlassian/a11y-jest-testing': 'workspace:^',
					'@atlassian/analytics-tooling': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/gemini': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@atlassian/testing-library': 'workspace:^',
					'@testing-library/dom': 'root:*',
					'@testing-library/jest-dom': 'root:*',
					'@types/facepaint': 'root:*',
					'@types/lorem-ipsum': 'root:*',
					'@types/react': 'root:*',
					'@types/react-loadable': 'root:*',
					'@types/use-sync-external-store': 'root:*',
					'abortcontroller-polyfill': 'root:*',
					brace: 'root:*',
					'fetch-mock': 'root:*',
					'jest-extended': 'root:*',
					'jest-fetch-mock': 'root:*',
					'jest-mock': 'root:*',
					jsdom: 'root:*',
					'lorem-ipsum': 'root:*',
					react: 'root:*',
					'react-ace': 'root:*',
					'react-beautiful-dnd': 'root:*',
					'react-dom': 'root:*',
					'react-intl': 'root:*',
					'react-test-renderer': 'root:*',
					'ts-jest': 'root:*',
					'xhr-mock': 'root:*',
				},
				techstack: {
					'@repo/internal': {
						'design-tokens': ['color', 'spacing'],
						styling: ['compiled'],
					},
					'@atlassian/frontend': {
						'import-structure': ['atlassian-conventions'],
						'circular-dependencies': ['file-and-folder-level'],
					},
				},
				exports: {
					'./analytics': './src/entry-points/analytics.ts',
					'./analytics/types': './src/entry-points/analytics-types.ts',
					'./card/lazy': './src/entry-points/card-lazy.ts',
					'./card/types': './src/entry-points/card-types.ts',
					'./class-names': './src/entry-points/class-names.ts',
					'./embed-resize-message-listener': './src/entry-points/embed-resize-message-listener.ts',
					'./enums': './src/entry-points/enums.ts',
					'./expanded-frame': './src/entry-points/expanded-frame.ts',
					'./flexible/assigned-to-element': './src/entry-points/flexible-assigned-to-element.tsx',
					'./flexible/assigned-to-group-element':
						'./src/entry-points/flexible-assigned-to-group-element.tsx',
					'./flexible/attachment-count-element':
						'./src/entry-points/flexible-attachment-count-element.tsx',
					'./flexible/author-group-element': './src/entry-points/flexible-author-group-element.tsx',
					'./flexible/checklist-progress-element':
						'./src/entry-points/flexible-checklist-progress-element.tsx',
					'./flexible/collaborator-group-element':
						'./src/entry-points/flexible-collaborator-group-element.tsx',
					'./flexible/comment-count-element':
						'./src/entry-points/flexible-comment-count-element.tsx',
					'./flexible/copy-link-action': './src/entry-points/flexible-copy-link-action.tsx',
					'./flexible/created-by-element': './src/entry-points/flexible-created-by-element.tsx',
					'./flexible/created-on-element': './src/entry-points/flexible-created-on-element.tsx',
					'./flexible/custom-action': './src/entry-points/flexible-custom-action.tsx',
					'./flexible/custom-block': './src/entry-points/flexible-custom-block.ts',
					'./flexible/custom-by-access-type-element':
						'./src/entry-points/flexible-custom-by-access-type-element.ts',
					'./flexible/custom-by-status-element':
						'./src/entry-points/flexible-custom-by-status-element.ts',
					'./flexible/custom-unresolved-action':
						'./src/entry-points/flexible-custom-unresolved-action.ts',
					'./flexible/download-action': './src/entry-points/flexible-download-action.tsx',
					'./flexible/due-on-element': './src/entry-points/flexible-due-on-element.tsx',
					'./flexible/follow-action': './src/entry-points/flexible-follow-action.tsx',
					'./flexible/footer-block': './src/entry-points/flexible-footer-block.ts',
					'./flexible/latest-commit-element':
						'./src/entry-points/flexible-latest-commit-element.tsx',
					'./flexible/link-icon-element': './src/entry-points/flexible-link-icon-element.tsx',
					'./flexible/location-element': './src/entry-points/flexible-location-element.tsx',
					'./flexible/metadata-block': './src/entry-points/flexible-metadata-block.ts',
					'./flexible/modified-by-element': './src/entry-points/flexible-modified-by-element.tsx',
					'./flexible/modified-on-element': './src/entry-points/flexible-modified-on-element.tsx',
					'./flexible/owned-by-element': './src/entry-points/flexible-owned-by-element.tsx',
					'./flexible/owned-by-group-element':
						'./src/entry-points/flexible-owned-by-group-element.tsx',
					'./flexible/preview-action': './src/entry-points/flexible-preview-action.tsx',
					'./flexible/preview-block': './src/entry-points/flexible-preview-block.ts',
					'./flexible/preview-element': './src/entry-points/flexible-preview-element.tsx',
					'./flexible/priority-element': './src/entry-points/flexible-priority-element.tsx',
					'./flexible/programming-language-element':
						'./src/entry-points/flexible-programming-language-element.tsx',
					'./flexible/provider-element': './src/entry-points/flexible-provider-element.tsx',
					'./flexible/react-count-element': './src/entry-points/flexible-react-count-element.tsx',
					'./flexible/read-time-element': './src/entry-points/flexible-read-time-element.tsx',
					'./flexible/sent-on-element': './src/entry-points/flexible-sent-on-element.tsx',
					'./flexible/snippet-block': './src/entry-points/flexible-snippet-block.ts',
					'./flexible/snippet-element': './src/entry-points/flexible-snippet-element.tsx',
					'./flexible/source-branch-element':
						'./src/entry-points/flexible-source-branch-element.tsx',
					'./flexible/state-element': './src/entry-points/flexible-state-element.tsx',
					'./flexible/story-points-element': './src/entry-points/flexible-story-points-element.tsx',
					'./flexible/sub-tasks-progress-element':
						'./src/entry-points/flexible-sub-tasks-progress-element.tsx',
					'./flexible/subscriber-count-element':
						'./src/entry-points/flexible-subscriber-count-element.tsx',
					'./flexible/target-branch-element':
						'./src/entry-points/flexible-target-branch-element.tsx',
					'./flexible/title-block': './src/entry-points/flexible-title-block.ts',
					'./flexible/title-element': './src/entry-points/flexible-title-element.tsx',
					'./flexible/types': './src/entry-points/flexible-types.ts',
					'./flexible/unresolved-action': './src/entry-points/flexible-unresolved-action.tsx',
					'./flexible/view-count-element': './src/entry-points/flexible-view-count-element.tsx',
					'./flexible/vote-count-element': './src/entry-points/flexible-vote-count-element.tsx',
					'./hook/use-smart-link-actions': './src/entry-points/hook-use-smart-link-actions.ts',
					'./hook/use-smart-link-destination-url':
						'./src/entry-points/hook-use-smart-link-destination-url.ts',
					'./hook/use-smart-link-events': './src/entry-points/hook-use-smart-link-events.ts',
					'./hook/use-smart-link-reload': './src/entry-points/hook-use-smart-link-reload.ts',
					'./hover': './src/entry-points/hover.ts',
					'./hover/types': './src/entry-points/hover-types.ts',
					'./link': './src/entry-points/link.ts',
					'./link/types': './src/entry-points/link-types.ts',
					'./ssr': './src/entry-points/ssr.ts',
					'./types': './src/types.ts',
					'./hooks': './src/hooks.ts',
					'./hover-card': './src/hoverCard.ts',
					'./link-url': './src/linkUrl.ts',
					'./preload-lazy-card-with-url-content': './src/preloadLazyCardWithUrlContent.ts',
					'./i18n/*': {
						publish: null,
						default: './src/i18n/*.ts',
					},
					'.': './src/index.ts',
				},
				'platform-feature-flags': {
					platform_navx_3298_message_wrapper: {
						type: 'boolean',
					},
					platform_lp_use_entity_icon_url_for_icon: {
						type: 'boolean',
					},
					'platform_bandicoots-smartlink-unresolved-error-key': {
						type: 'boolean',
					},
					'platform-smart-card-shift-key': {
						type: 'boolean',
					},
					'confluence-issue-terminology-refresh': {
						type: 'boolean',
					},
					platform_editor_content_mode_button_mvp: {
						type: 'boolean',
					},
					'product-terminology-refresh': {
						type: 'boolean',
					},
					platform_smartlink_3pclick_analytics: {
						type: 'boolean',
					},
					platform_smartlink_xpc_url_wrapping: {
						type: 'boolean',
					},
					platform_smartlink_xpc_url_wrapping_window_existed: {
						type: 'boolean',
					},
					'navx-1895-new-logo-design': {
						type: 'boolean',
					},
					'jfp-magma-platform-lozenge-jump-fix': {
						type: 'boolean',
					},
					platform_sl_3p_auth_rovo_action_kill_switch: {
						type: 'boolean',
					},
					platform_sl_connect_account_flag: {
						type: 'boolean',
					},
					'platform-dst-shape-theme-default': {
						type: 'boolean',
					},
					'jpx-1074-smart-links-iframe': {
						type: 'boolean',
					},
					platform_sl_3p_preauth_better_hovercard_killswitch: {
						type: 'boolean',
					},
					platform_sl_3p_preauth_soc_proof_inline_killswitch: {
						type: 'boolean',
					},
					platform_lp_social_proof_inline_overflow_bug: {
						type: 'boolean',
					},
					platform_navx_smart_link_icon_label_a11y: {
						type: 'boolean',
					},
					billplat_a11y_icon_label_fix: {
						type: 'boolean',
						referenceOnly: true,
					},
					'platform-dst-lozenge-tag-badge-visual-uplifts': {
						type: 'boolean',
					},
					'smart-card-inline-resolved-view-refactor': {
						type: 'boolean',
					},
					platform_sl_3p_auth_rovo_embed_footer_kill_switch: {
						type: 'boolean',
					},
					platform_sl_3p_auth_rovo_embed_footer_exp: {
						type: 'boolean',
						referenceOnly: true,
					},
					'dfo-fix-preview-dynamic-style': {
						type: 'boolean',
					},
					platform_sl_icons_refactor: {
						type: 'boolean',
					},
					'social-proof-3p-unauth-block-fg': {
						type: 'boolean',
					},
					platform_sl_incoming_outgoing_tenant_info_killswitch: {
						type: 'boolean',
					},
					platform_navx_block_card_footer_spacing: {
						type: 'boolean',
					},
					'navx-4957-sl-embed-modal-a11y-label': {
						type: 'boolean',
					},
					platform_sl_3p_post_auth_chat_open_fg: {
						type: 'boolean',
					},
					platform_sl_3p_auth_inline_tailored_cta_killswitch: {
						type: 'boolean',
					},
					platform_smartlink_inline_resolve_optimization: {
						type: 'boolean',
					},
					dfo_issue_view_remote_data_srr_group: {
						type: 'boolean',
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/f74ef1bc-7240-4aac-9dc8-9dc43b502089',
			},
		},
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
		import: {
			name: 'useSmartLinkEvents',
			package: '@atlaskit/smart-card',
			type: 'named',
			packagePath:
				'/Users/khall2/.codex/worktrees/bd80/atlassian-frontend-monorepo/platform/packages/linking-platform/smart-card',
			packageJson: {
				name: '@atlaskit/smart-card',
				version: '45.6.0',
				description: 'Smart card component',
				publishConfig: {
					registry: 'https://registry.npmjs.org/',
				},
				repository: 'https://bitbucket.org/atlassian/atlassian-frontend-mirror',
				author: 'Atlassian Pty Ltd',
				license: 'Apache-2.0',
				main: 'dist/cjs/index.js',
				module: 'dist/esm/index.js',
				'module:es2019': 'dist/es2019/index.js',
				types: 'dist/types/index.d.ts',
				sideEffects: ['**/*.compiled.css'],
				'atlaskit:src': 'src/index.ts',
				atlassian: {
					i18n: true,
					'react-compiler': {
						enabled: true,
						gating: {
							source: '@atlaskit/react-compiler-gating',
							importSpecifierName: 'isReactCompilerActivePlatform',
						},
					},
					team: 'Navigation Experiences - Linking Platform',
					website: {
						name: 'Smart Card',
					},
				},
				scripts: {
					'analytics:codegen':
						'yarn workspace @atlassian/analytics-tooling run analytics:codegen smart-card --output ./src/common/analytics/generated',
					'ak-postbuild': 'ls -d dist/* | xargs -n 1 copyfiles -u 1 -V src/**/*.{svg,png}',
				},
				dependencies: {
					'@atlaskit/adf-utils': 'workspace:^',
					'@atlaskit/afm-i18n-platform-linking-platform-smart-card': 'root:*',
					'@atlaskit/analytics-cross-product': 'workspace:^',
					'@atlaskit/analytics-gas-types': 'workspace:^',
					'@atlaskit/analytics-next': 'workspace:^',
					'@atlaskit/avatar': 'workspace:^',
					'@atlaskit/avatar-group': 'workspace:^',
					'@atlaskit/badge': 'workspace:^',
					'@atlaskit/browser-apis': 'workspace:^',
					'@atlaskit/button': 'workspace:^',
					'@atlaskit/checkbox': 'workspace:^',
					'@atlaskit/css': 'workspace:^',
					'@atlaskit/dropdown-menu': 'workspace:^',
					'@atlaskit/embedded-confluence': 'workspace:^',
					'@atlaskit/feature-gate-js-client': 'workspace:^',
					'@atlaskit/flag': 'workspace:^',
					'@atlaskit/form': 'workspace:^',
					'@atlaskit/frontend-utilities': 'workspace:^',
					'@atlaskit/heading': 'workspace:^',
					'@atlaskit/icon': 'workspace:^',
					'@atlaskit/icon-file-type': 'workspace:^',
					'@atlaskit/icon-lab': 'workspace:^',
					'@atlaskit/image': 'workspace:^',
					'@atlaskit/json-ld-types': 'workspace:^',
					'@atlaskit/link': 'workspace:^',
					'@atlaskit/link-analytics': 'workspace:^',
					'@atlaskit/link-client-extension': 'workspace:^',
					'@atlaskit/link-extractors': 'workspace:^',
					'@atlaskit/link-test-helpers': 'workspace:^',
					'@atlaskit/linking-common': 'workspace:^',
					'@atlaskit/linking-types': 'workspace:^',
					'@atlaskit/logo': 'workspace:^',
					'@atlaskit/lozenge': 'workspace:^',
					'@atlaskit/menu': 'workspace:^',
					'@atlaskit/modal-dialog': 'workspace:^',
					'@atlaskit/motion': 'workspace:^',
					'@atlaskit/object': 'workspace:^',
					'@atlaskit/outbound-auth-flow-client': 'workspace:^',
					'@atlaskit/platform-feature-flags': 'workspace:^',
					'@atlaskit/platform-feature-flags-react': 'workspace:^',
					'@atlaskit/popup': 'workspace:^',
					'@atlaskit/primitives': 'workspace:^',
					'@atlaskit/react-compiler-gating': 'workspace:^',
					'@atlaskit/react-ufo': 'workspace:^',
					'@atlaskit/rovo-triggers': 'workspace:^',
					'@atlaskit/section-message': 'workspace:^',
					'@atlaskit/select': 'workspace:^',
					'@atlaskit/spinner': 'workspace:^',
					'@atlaskit/tag': 'workspace:^',
					'@atlaskit/textarea': 'workspace:^',
					'@atlaskit/textfield': 'workspace:^',
					'@atlaskit/theme': 'workspace:^',
					'@atlaskit/tile': 'workspace:^',
					'@atlaskit/tmp-editor-statsig': 'workspace:^',
					'@atlaskit/tokens': 'workspace:^',
					'@atlaskit/tooltip': 'workspace:^',
					'@atlaskit/ufo': 'workspace:^',
					'@atlaskit/width-detector': 'workspace:^',
					'@babel/runtime': 'root:*',
					'@compiled/react': 'root:*',
					'@formatjs/intl-utils': 'root:*',
					facepaint: 'root:*',
					lru_map: 'root:*',
					'markdown-to-jsx': 'root:*',
					'react-error-boundary': 'root:*',
					'react-lazily-render': 'root:*',
					'react-loadable': 'root:*',
					'react-magnetic-di': 'root:*',
					'react-render-image': 'root:*',
					'use-sync-external-store': 'root:*',
					uuid: 'root:*',
				},
				peerDependencies: {
					'@atlaskit/link-provider': 'workspace:^',
					react: '^18.2.0',
					'react-dom': '^18.2.0',
					'react-intl': '^5.25.1 || ^6.0.0 || ^7.0.0',
				},
				devDependencies: {
					'@af/integration-testing': 'workspace:^',
					'@af/visual-regression': 'workspace:^',
					'@atlaskit/analytics-listeners': 'workspace:^',
					'@atlaskit/css-reset': 'workspace:^',
					'@atlaskit/media-test-helpers': 'workspace:^',
					'@atlaskit/ssr': 'workspace:^',
					'@atlassian/a11y-jest-testing': 'workspace:^',
					'@atlassian/analytics-tooling': 'workspace:^',
					'@atlassian/feature-flags-test-utils': 'workspace:^',
					'@atlassian/gemini': 'workspace:^',
					'@atlassian/structured-docs-types': 'workspace:^',
					'@atlassian/testing-library': 'workspace:^',
					'@testing-library/dom': 'root:*',
					'@testing-library/jest-dom': 'root:*',
					'@types/facepaint': 'root:*',
					'@types/lorem-ipsum': 'root:*',
					'@types/react': 'root:*',
					'@types/react-loadable': 'root:*',
					'@types/use-sync-external-store': 'root:*',
					'abortcontroller-polyfill': 'root:*',
					brace: 'root:*',
					'fetch-mock': 'root:*',
					'jest-extended': 'root:*',
					'jest-fetch-mock': 'root:*',
					'jest-mock': 'root:*',
					jsdom: 'root:*',
					'lorem-ipsum': 'root:*',
					react: 'root:*',
					'react-ace': 'root:*',
					'react-beautiful-dnd': 'root:*',
					'react-dom': 'root:*',
					'react-intl': 'root:*',
					'react-test-renderer': 'root:*',
					'ts-jest': 'root:*',
					'xhr-mock': 'root:*',
				},
				techstack: {
					'@repo/internal': {
						'design-tokens': ['color', 'spacing'],
						styling: ['compiled'],
					},
					'@atlassian/frontend': {
						'import-structure': ['atlassian-conventions'],
						'circular-dependencies': ['file-and-folder-level'],
					},
				},
				exports: {
					'./analytics': './src/entry-points/analytics.ts',
					'./analytics/types': './src/entry-points/analytics-types.ts',
					'./card/lazy': './src/entry-points/card-lazy.ts',
					'./card/types': './src/entry-points/card-types.ts',
					'./class-names': './src/entry-points/class-names.ts',
					'./embed-resize-message-listener': './src/entry-points/embed-resize-message-listener.ts',
					'./enums': './src/entry-points/enums.ts',
					'./expanded-frame': './src/entry-points/expanded-frame.ts',
					'./flexible/assigned-to-element': './src/entry-points/flexible-assigned-to-element.tsx',
					'./flexible/assigned-to-group-element':
						'./src/entry-points/flexible-assigned-to-group-element.tsx',
					'./flexible/attachment-count-element':
						'./src/entry-points/flexible-attachment-count-element.tsx',
					'./flexible/author-group-element': './src/entry-points/flexible-author-group-element.tsx',
					'./flexible/checklist-progress-element':
						'./src/entry-points/flexible-checklist-progress-element.tsx',
					'./flexible/collaborator-group-element':
						'./src/entry-points/flexible-collaborator-group-element.tsx',
					'./flexible/comment-count-element':
						'./src/entry-points/flexible-comment-count-element.tsx',
					'./flexible/copy-link-action': './src/entry-points/flexible-copy-link-action.tsx',
					'./flexible/created-by-element': './src/entry-points/flexible-created-by-element.tsx',
					'./flexible/created-on-element': './src/entry-points/flexible-created-on-element.tsx',
					'./flexible/custom-action': './src/entry-points/flexible-custom-action.tsx',
					'./flexible/custom-block': './src/entry-points/flexible-custom-block.ts',
					'./flexible/custom-by-access-type-element':
						'./src/entry-points/flexible-custom-by-access-type-element.ts',
					'./flexible/custom-by-status-element':
						'./src/entry-points/flexible-custom-by-status-element.ts',
					'./flexible/custom-unresolved-action':
						'./src/entry-points/flexible-custom-unresolved-action.ts',
					'./flexible/download-action': './src/entry-points/flexible-download-action.tsx',
					'./flexible/due-on-element': './src/entry-points/flexible-due-on-element.tsx',
					'./flexible/follow-action': './src/entry-points/flexible-follow-action.tsx',
					'./flexible/footer-block': './src/entry-points/flexible-footer-block.ts',
					'./flexible/latest-commit-element':
						'./src/entry-points/flexible-latest-commit-element.tsx',
					'./flexible/link-icon-element': './src/entry-points/flexible-link-icon-element.tsx',
					'./flexible/location-element': './src/entry-points/flexible-location-element.tsx',
					'./flexible/metadata-block': './src/entry-points/flexible-metadata-block.ts',
					'./flexible/modified-by-element': './src/entry-points/flexible-modified-by-element.tsx',
					'./flexible/modified-on-element': './src/entry-points/flexible-modified-on-element.tsx',
					'./flexible/owned-by-element': './src/entry-points/flexible-owned-by-element.tsx',
					'./flexible/owned-by-group-element':
						'./src/entry-points/flexible-owned-by-group-element.tsx',
					'./flexible/preview-action': './src/entry-points/flexible-preview-action.tsx',
					'./flexible/preview-block': './src/entry-points/flexible-preview-block.ts',
					'./flexible/preview-element': './src/entry-points/flexible-preview-element.tsx',
					'./flexible/priority-element': './src/entry-points/flexible-priority-element.tsx',
					'./flexible/programming-language-element':
						'./src/entry-points/flexible-programming-language-element.tsx',
					'./flexible/provider-element': './src/entry-points/flexible-provider-element.tsx',
					'./flexible/react-count-element': './src/entry-points/flexible-react-count-element.tsx',
					'./flexible/read-time-element': './src/entry-points/flexible-read-time-element.tsx',
					'./flexible/sent-on-element': './src/entry-points/flexible-sent-on-element.tsx',
					'./flexible/snippet-block': './src/entry-points/flexible-snippet-block.ts',
					'./flexible/snippet-element': './src/entry-points/flexible-snippet-element.tsx',
					'./flexible/source-branch-element':
						'./src/entry-points/flexible-source-branch-element.tsx',
					'./flexible/state-element': './src/entry-points/flexible-state-element.tsx',
					'./flexible/story-points-element': './src/entry-points/flexible-story-points-element.tsx',
					'./flexible/sub-tasks-progress-element':
						'./src/entry-points/flexible-sub-tasks-progress-element.tsx',
					'./flexible/subscriber-count-element':
						'./src/entry-points/flexible-subscriber-count-element.tsx',
					'./flexible/target-branch-element':
						'./src/entry-points/flexible-target-branch-element.tsx',
					'./flexible/title-block': './src/entry-points/flexible-title-block.ts',
					'./flexible/title-element': './src/entry-points/flexible-title-element.tsx',
					'./flexible/types': './src/entry-points/flexible-types.ts',
					'./flexible/unresolved-action': './src/entry-points/flexible-unresolved-action.tsx',
					'./flexible/view-count-element': './src/entry-points/flexible-view-count-element.tsx',
					'./flexible/vote-count-element': './src/entry-points/flexible-vote-count-element.tsx',
					'./hook/use-smart-link-actions': './src/entry-points/hook-use-smart-link-actions.ts',
					'./hook/use-smart-link-destination-url':
						'./src/entry-points/hook-use-smart-link-destination-url.ts',
					'./hook/use-smart-link-events': './src/entry-points/hook-use-smart-link-events.ts',
					'./hook/use-smart-link-reload': './src/entry-points/hook-use-smart-link-reload.ts',
					'./hover': './src/entry-points/hover.ts',
					'./hover/types': './src/entry-points/hover-types.ts',
					'./link': './src/entry-points/link.ts',
					'./link/types': './src/entry-points/link-types.ts',
					'./ssr': './src/entry-points/ssr.ts',
					'./types': './src/types.ts',
					'./hooks': './src/hooks.ts',
					'./hover-card': './src/hoverCard.ts',
					'./link-url': './src/linkUrl.ts',
					'./preload-lazy-card-with-url-content': './src/preloadLazyCardWithUrlContent.ts',
					'./i18n/*': {
						publish: null,
						default: './src/i18n/*.ts',
					},
					'.': './src/index.ts',
				},
				'platform-feature-flags': {
					platform_navx_3298_message_wrapper: {
						type: 'boolean',
					},
					platform_lp_use_entity_icon_url_for_icon: {
						type: 'boolean',
					},
					'platform_bandicoots-smartlink-unresolved-error-key': {
						type: 'boolean',
					},
					'platform-smart-card-shift-key': {
						type: 'boolean',
					},
					'confluence-issue-terminology-refresh': {
						type: 'boolean',
					},
					platform_editor_content_mode_button_mvp: {
						type: 'boolean',
					},
					'product-terminology-refresh': {
						type: 'boolean',
					},
					platform_smartlink_3pclick_analytics: {
						type: 'boolean',
					},
					platform_smartlink_xpc_url_wrapping: {
						type: 'boolean',
					},
					platform_smartlink_xpc_url_wrapping_window_existed: {
						type: 'boolean',
					},
					'navx-1895-new-logo-design': {
						type: 'boolean',
					},
					'jfp-magma-platform-lozenge-jump-fix': {
						type: 'boolean',
					},
					platform_sl_3p_auth_rovo_action_kill_switch: {
						type: 'boolean',
					},
					platform_sl_connect_account_flag: {
						type: 'boolean',
					},
					'platform-dst-shape-theme-default': {
						type: 'boolean',
					},
					'jpx-1074-smart-links-iframe': {
						type: 'boolean',
					},
					platform_sl_3p_preauth_better_hovercard_killswitch: {
						type: 'boolean',
					},
					platform_sl_3p_preauth_soc_proof_inline_killswitch: {
						type: 'boolean',
					},
					platform_lp_social_proof_inline_overflow_bug: {
						type: 'boolean',
					},
					platform_navx_smart_link_icon_label_a11y: {
						type: 'boolean',
					},
					billplat_a11y_icon_label_fix: {
						type: 'boolean',
						referenceOnly: true,
					},
					'platform-dst-lozenge-tag-badge-visual-uplifts': {
						type: 'boolean',
					},
					'smart-card-inline-resolved-view-refactor': {
						type: 'boolean',
					},
					platform_sl_3p_auth_rovo_embed_footer_kill_switch: {
						type: 'boolean',
					},
					platform_sl_3p_auth_rovo_embed_footer_exp: {
						type: 'boolean',
						referenceOnly: true,
					},
					'dfo-fix-preview-dynamic-style': {
						type: 'boolean',
					},
					platform_sl_icons_refactor: {
						type: 'boolean',
					},
					'social-proof-3p-unauth-block-fg': {
						type: 'boolean',
					},
					platform_sl_incoming_outgoing_tenant_info_killswitch: {
						type: 'boolean',
					},
					platform_navx_block_card_footer_spacing: {
						type: 'boolean',
					},
					'navx-4957-sl-embed-modal-a11y-label': {
						type: 'boolean',
					},
					platform_sl_3p_post_auth_chat_open_fg: {
						type: 'boolean',
					},
					platform_sl_3p_auth_inline_tailored_cta_killswitch: {
						type: 'boolean',
					},
					platform_smartlink_inline_resolve_optimization: {
						type: 'boolean',
					},
					dfo_issue_view_remote_data_srr_group: {
						type: 'boolean',
					},
				},
				compassUnitTestMetricSourceId:
					'ari:cloud:compass:a436116f-02ce-4520-8fbb-7301462a1674:metric-source/c5751cc6-3513-4070-9deb-af31e86aed34/f74ef1bc-7240-4aac-9dc8-9dc43b502089',
			},
		},
		package: '@atlaskit/smart-card',
		examples: [
			"import {\n\tAnalyticsContext,\n\tAnalyticsListener,\n\ttype UIAnalyticsEvent,\n} from '@atlaskit/analytics-next';\nimport Heading from '@atlaskit/heading';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box, Text, xcss } from '@atlaskit/primitives';\nimport { Card } from '../../src';\nconst headingBoxStyles = xcss({\n\tmarginBottom: 'space.100',\n});\nconst stackBoxStyles = xcss({\n\tmarginTop: 'space.100',\n});\ntype ExampleComponentProps = {\n\tsetRecentEvents: React.Dispatch<React.SetStateAction<UIAnalyticsEvent[]>>;\n};\nconst ExampleComponent = ({ setRecentEvents }: ExampleComponentProps): JSX.Element => {\n\tconst handleOnClick = React.useCallback(\n\t\t(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {\n\t\t\te.preventDefault();\n\t\t\treturn;\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<AnalyticsListener\n\t\t\tonEvent={(event) => {\n\t\t\t\tsetRecentEvents((prevEvents) => [...prevEvents, event]);\n\t\t\t}}\n\t\t\tchannel=\"*\"\n\t\t>\n\t\t\t<AnalyticsContext\n\t\t\t\tdata={{\n\t\t\t\t\tsource: 'content',\n\t\t\t\t\tattributes: {\n\t\t\t\t\t\tdisplayCategory: 'link',\n\t\t\t\t\t\tdisplay: 'url',\n\t\t\t\t\t\tid: '123',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t<SmartCardProvider client={new ResolvedClient('dev')}>\n\t\t\t\t\t<Card\n\t\t\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\t\t\tappearance=\"inline\"\n\t\t\t\t\t\tplatform=\"web\"\n\t\t\t\t\t\tshowHoverPreview={true}\n\t\t\t\t\t\tonClick={handleOnClick}\n\t\t\t\t\t/>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</AnalyticsContext>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default (): React.JSX.Element => {\n\tconst [recentEvents, setRecentEvents] = React.useState<UIAnalyticsEvent[]>([]);\n\tconst mostRecent10Events = React.useMemo(() => {\n\t\treturn Array.from({ length: 10 }, (_, i) => {\n\t\t\treturn recentEvents.at(recentEvents.length - i - 1);\n\t\t});\n\t}, [recentEvents]);\n\treturn (\n\t\t<Box>\n\t\t\t<Box xcss={headingBoxStyles}>\n\t\t\t\t<Heading size=\"medium\">Interact with the link below and see events being fired</Heading>\n\t\t\t</Box>\n\t\t\t<ExampleComponent setRecentEvents={setRecentEvents} />\n\t\t\t<Box xcss={stackBoxStyles}>\n\t\t\t\t<Heading size=\"small\">The 10 Most Recent Events Fired</Heading>\n\t\t\t\t<ol>\n\t\t\t\t\t{mostRecent10Events.map((event, index) => {\n\t\t\t\t\t\tif (event === undefined) {\n\t\t\t\t\t\t\treturn <li key={index}></li>;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst { action, actionSubject, eventType } = event.payload;\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<li key={index}>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\tkey={index}\n\t\t\t\t\t\t\t\t>{`actionSubject: ${actionSubject}, action: ${action}, eventType: ${eventType}`}</Text>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t);\n\t\t\t\t\t})}\n\t\t\t\t</ol>\n\t\t\t</Box>\n\t\t</Box>\n\t);\n};",
		],
	},
];

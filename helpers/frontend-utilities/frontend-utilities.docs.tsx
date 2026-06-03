/**
 * Structured MCP docs for `@atlaskit/frontend-utilities`.
 *
 * ⚠️ Pilot / not yet final. This file is part of the libraries-content pilot
 * for the "Libraries, hooks, utilities in structured content" RFC. The
 * container schema and per-kind shapes are still in review — expect breaking
 * changes before this is rolled out broadly. Do not depend on the format yet.
 *
 * Non-ADS pilot. A cross-team grab-bag of small frontend helpers: React
 * hooks (`useInterval`, `useLocalStorage`, debug hooks), an error normaliser,
 * a retry helper, browser-storage test mocks, and a deterministic hash.
 * Demonstrates the `hooks` + `utilities` (kind: 'function' | 'constant')
 * combination in a package outside the design system.
 *
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/frontend-utilities',
		packagePath,
		packageJson,
		overview:
			'A collection of small, framework-agnostic frontend helpers used across Atlassian products. Provides custom React hooks (`useInterval`, `useLocalStorage`, `usePrevious`, plus debug helpers), an error-normalisation helper (`convertToError`), a retry wrapper for flaky promises (`retryOnException`), browser-storage test mocks (`STORAGE_MOCK`, `mockWindowStorage`), and a deterministic non-cryptographic string hash (`simpleHash`). Each utility ships at the package root and via a dedicated subpath export so consumers can tree-shake to a single helper.',
	},
	hooks: [
		{
			name: 'useInterval',
			description:
				'Declarative wrapper around `setInterval`. Re-runs the latest `callback` every `delay` milliseconds and clears the timer on unmount or when `delay` changes. Passing `null` for `delay` pauses the timer without unmounting the hook.',
			status: 'general-availability',
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
			usageGuidelines: [
				'Use for polling, ticking clocks, or any callback that needs to fire on a fixed cadence inside a React component.',
				'Pass `null` for `delay` to pause — do not unmount the component just to stop the timer.',
				'The callback is captured by ref, so referencing the latest props/state in it does not require putting them in any dependency array.',
			],
			keywords: ['hook', 'useInterval', 'setInterval', 'polling', 'frontend-utilities'],
			categories: ['hooks', 'timers'],
			examples: [],
		},
		{
			name: 'usePrevious',
			description:
				'Returns the previous render-cycle value of `value`. On the first render the hook returns `undefined`; subsequent renders return the value supplied on the prior render.',
			status: 'general-availability',
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
			usageGuidelines: [
				'Use for change-detection effects — e.g. firing analytics only when a prop transitions from one value to another.',
				'Do not store derived state in `usePrevious`; prefer a `useEffect` that mirrors the change you care about.',
				'`undefined` on the first render is intentional — initialise downstream logic to handle that case.',
			],
			keywords: ['hook', 'usePrevious', 'previous-value', 'frontend-utilities'],
			categories: ['hooks', 'state'],
			examples: [],
		},
		{
			name: 'useLocalStorage',
			description:
				'`useState`-shaped wrapper around `window.localStorage` with built-in JSON serialisation and a wrapper that survives the storage being unavailable (e.g. private browsing modes that throw). Persists `value` under `key` and rehydrates it on mount.',
			status: 'general-availability',
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
			usageGuidelines: [
				'Use for user-scoped preferences that should survive a page refresh (collapsed sidebar state, last-used view, etc.).',
				'Do not store secrets or large blobs — `localStorage` is plaintext and capped at ~5 MB per origin.',
				'Values are JSON-serialised; non-serialisable values (functions, `Symbol`, circular refs) will be lost on rehydrate.',
			],
			keywords: ['hook', 'useLocalStorage', 'storage', 'persistence', 'frontend-utilities'],
			categories: ['hooks', 'storage'],
			examples: [],
		},
		{
			name: 'useLocalStorageRecord',
			description:
				'Persistent bounded log built on top of `useLocalStorage`. Stores up to `maxLength` items keyed by stringified equality and exposes `putRecord` / `removeRecord` actions for append-only collections like recent searches.',
			status: 'general-availability',
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
			usageGuidelines: [
				'Use for capped histories (recent searches, recently visited items, undo stacks).',
				'`removeRecord(query)` matches by JSON-stringified inclusion, not by identity — pass a stable substring of the record to remove.',
				'Equality is structural via `JSON.stringify`: pushing a record that stringifies the same as an existing one is a no-op.',
			],
			keywords: ['hook', 'useLocalStorageRecord', 'history', 'storage', 'frontend-utilities'],
			categories: ['hooks', 'storage'],
			examples: [],
		},
		{
			name: 'useWhyDidUpdate',
			description:
				'Development-only debug hook that logs which dependencies changed since the previous render, using deep equality (`lodash.isEqual`). Useful for diagnosing unexpected re-renders when the data inside a prop looks identical but the reference changed.',
			status: 'general-availability',
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
			usageGuidelines: [
				'Use locally while debugging; remove before shipping. The hook short-circuits in production (`NODE_ENV === "production"`) but the import and call still ship.',
				'Pass the same array shape you would pass to `useEffect` deps for the comparison to mean anything.',
				'Prefer `useWhyDidUpdateShallow` when you want to mirror React\'s own re-render trigger.',
			],
			keywords: ['hook', 'useWhyDidUpdate', 'debug', 'rerender', 'frontend-utilities'],
			categories: ['hooks', 'debugging'],
			examples: [],
		},
		{
			name: 'useWhyDidUpdateShallow',
			description:
				'Variant of `useWhyDidUpdate` that compares dependencies with `Object.is` (shallow / reference equality) — the same comparison React itself uses to decide whether to re-render. Useful when you want to find out which prop is changing identity from one render to the next.',
			status: 'general-availability',
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
			usageGuidelines: [
				'Reach for this hook first when chasing "why is this re-rendering" — it matches React\'s own equality semantics. Drop to `useWhyDidUpdate` only when you suspect the content changed but the reference did not.',
				'Same production-stripping behaviour as `useWhyDidUpdate` — log calls are no-ops in prod builds.',
			],
			keywords: ['hook', 'useWhyDidUpdateShallow', 'debug', 'rerender', 'frontend-utilities'],
			categories: ['hooks', 'debugging'],
			examples: [],
		},
	],
	utilities: [
		{
			kind: 'function',
			name: 'convertToError',
			description:
				'Normalises any value thrown by a `try`/`catch` into an `Error` instance — useful at the boundary between untyped JS code (which can throw strings, objects, or `undefined`) and TypeScript code that wants a real `Error`.',
			status: 'general-availability',
			signature: '(e: unknown) => Error',
			parameters: [
				{
					name: 'e',
					type: 'unknown',
					description: 'The caught value. Already-`Error` instances are returned unchanged.',
				},
			],
			returns: {
				type: 'Error',
				description:
					'The original value if it was already an `Error`; otherwise a freshly-constructed `Error` whose message describes the original (`JSON.stringify`d for objects, `String(...)`d otherwise).',
			},
			usageGuidelines: [
				'Use at every catch boundary that hands the error to logging, Sentry, or analytics — those consumers all assume a real `Error` with `.message` and a stack.',
				'Object errors are JSON-serialised; circular objects fall back to `String(...)`, so the stack you log will reflect where `convertToError` was called, not where the original value was thrown.',
			],
			keywords: ['utility', 'convertToError', 'error', 'frontend-utilities'],
			categories: ['utilities', 'error-handling'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'retryOnException',
			description:
				'Retries an async `invokeOperation` while the most recent error is in the `retryOn` allow-list, sleeping between attempts per `intervalsMS`. The sleep schedule defines both the number of retries and the delays between them — `intervalsMS: [0, 50, 100]` means "try once, then up to three retries at 0 ms, 50 ms, and 100 ms".',
			status: 'general-availability',
			signature:
				'<T>(invokeOperation: () => Promise<T>, config: RetryConfig) => Promise<T>',
			parameters: [
				{
					name: 'invokeOperation',
					type: '() => Promise<T>',
					description: 'The async operation to attempt. Called once per attempt.',
				},
				{
					name: 'config',
					type: '{ intervalsMS?: readonly number[]; retryOn?: (typeof Error)[] | ((e: Error) => boolean); captureException?: (error: Error, tags?: Record<string, string>) => void; onRetry?: (previousErr: Error) => void }',
					description:
						'`intervalsMS` defaults to `NO_RETRIES` (no retries). `retryOn` defaults to `[FailedFetchError]`. `captureException` is called for every caught error, including the final one. `onRetry` fires only between attempts, never before the first.',
				},
			],
			returns: {
				type: 'Promise<T>',
				description:
					'Resolves with the operation result on the first successful attempt. Rejects with the last caught error once `intervalsMS` is exhausted or an unmatched error is thrown.',
			},
			usageGuidelines: [
				'Pre-baked schedules live in `@atlaskit/frontend-utilities/retry-operation`: `NO_RETRIES`, `UP_TO_TWO_INSTANT_RETRIES`, `DEFAULT_RETRIES` (`[0, 50, 100]`), `LAZY_LOAD_RETRIES` (`[100, 500, 1000]`). Prefer one of those over hand-rolled arrays so retry semantics stay consistent across products.',
				'`retryOn` is allow-list, not deny-list — unmatched errors short-circuit and reject immediately. Throw `FailedFetchError` (or your own type that extends `Error`) from inside `invokeOperation` to opt into retries.',
				'`captureException` should fire-and-forget — do not throw from it, or the retry loop bails. Use it for Sentry reporting on every attempt.',
			],
			keywords: ['utility', 'retryOnException', 'retry', 'fetch', 'frontend-utilities'],
			categories: ['utilities', 'network', 'error-handling'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'mockWindowStorage',
			description:
				'Test helper that replaces `window.localStorage` and/or `window.sessionStorage` with an in-memory `STORAGE_MOCK` so unit tests can exercise storage-dependent code without touching the real browser storage (and without crashing in jsdom environments where storage may be disabled).',
			status: 'general-availability',
			signature: "(storageToMock?: ('localStorage' | 'sessionStorage')[]) => void",
			parameters: [
				{
					name: 'storageToMock',
					type: "('localStorage' | 'sessionStorage')[]",
					description: 'Which storage objects to replace. Defaults to both.',
					defaultValue: "['localStorage', 'sessionStorage']",
					isOptional: true,
				},
			],
			returns: {
				type: 'void',
			},
			usageGuidelines: [
				'Call once per test (in `beforeEach`) — each call installs a fresh `STORAGE_MOCK`, so tests are isolated.',
				'Handles SSR/jsdom environments where `window` may be undefined — safe to call in any Jest test.',
				'Production code must never call this. It is wired up under the `./local-storage` subpath alongside the test mock.',
			],
			keywords: ['utility', 'mockWindowStorage', 'storage', 'test', 'frontend-utilities'],
			categories: ['utilities', 'storage', 'testing'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'simpleHash',
			description:
				'Deterministic 32-bit string hash rendered in base-36 (e.g. `"hello" -> "y2sl1f"`). Stable across runs for the same input. NOT cryptographic — collisions are easy and the algorithm is not suitable for security.',
			status: 'general-availability',
			signature: '(str: string) => string',
			parameters: [
				{
					name: 'str',
					type: 'string',
					description: 'Input to hash.',
				},
			],
			returns: {
				type: 'string',
				description: 'Base-36 representation of a 32-bit signed-to-unsigned hash.',
			},
			usageGuidelines: [
				'Use for stable cache keys, telemetry-bucket assignments, or generating short anonymous identifiers from a known input.',
				'Do NOT use for password hashing, signing, or anything else where collisions or pre-image resistance matter.',
				'Output is stable across runtimes — safe to embed in URLs and analytics events.',
			],
			keywords: ['utility', 'simpleHash', 'hash', 'frontend-utilities'],
			categories: ['utilities', 'hashing'],
			examples: [],
		},
		{
			kind: 'constant',
			name: 'STORAGE_MOCK',
			description:
				'In-memory implementation of the DOM `Storage` interface used by `mockWindowStorage`. Exported directly so tests that need their own scoped mock (e.g. for `globalThis` shimming or browser-extension storage) can use it as a building block.',
			status: 'general-availability',
			type: 'Storage',
			value:
				'{ length: 0; getItem(id); setItem(id, val); removeItem(id); clear(); key(index) } — backed by an in-memory `_data` record.',
			usageGuidelines: [
				'Prefer `mockWindowStorage()` for typical Jest setups. Reach for `STORAGE_MOCK` directly only when you need to install storage somewhere other than `window` (e.g. a worker global).',
				'The mock is mutable and shared — wrap it with `{ ...STORAGE_MOCK }` before installing if you want per-test isolation manually.',
			],
			keywords: ['constant', 'STORAGE_MOCK', 'storage', 'test', 'frontend-utilities'],
			categories: ['utilities', 'storage', 'testing', 'constants'],
			examples: [],
		},
	],
};

export default documentation;

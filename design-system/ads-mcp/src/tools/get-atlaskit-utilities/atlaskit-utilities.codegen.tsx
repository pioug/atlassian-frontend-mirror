/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content utilities from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::967196502e12df47cd3e9e9a05dcdaea>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen:atlaskit-utilities
 */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import type { UtilityMcpPayload } from './types';

export const atlaskitUtilities: UtilityMcpPayload[] = [
	{
		name: 'a11yAuditExamples',
		description:
			'Runs an a11y audit against every constellation example for the given package(s). Use in a top-level test file to ensure every documented variant passes the design-system audit rules.',
		status: 'general-availability',
		usageGuidelines: [
			'One call per package or component group. Pair with `a11yAuditExamplesCLI()` if you want to run the same audit set from a CLI script outside jest.',
		],
		keywords: ['accessibility', 'a11y', 'examples', 'constellation', 'audit', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
	},
	{
		name: 'a11yAuditExamplesCLI',
		description:
			'CLI entry point for running the same constellation example audit as `a11yAuditExamples()` outside of jest.',
		status: 'general-availability',
		usageGuidelines: [
			'Use from a script when you want to validate examples without booting jest. Inside jest, prefer `a11yAuditExamples()`.',
		],
		keywords: ['accessibility', 'a11y', 'examples', 'cli', 'audit', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
	},
	{
		name: 'autoA11yCheck',
		description:
			'Runs the `@sa11y/jest` audit against the current document after each `it()` block. Wired into the design-system jest setup, so every component test gets a free a11y pass without per-test boilerplate.',
		status: 'general-availability',
		usageGuidelines: [
			"Already registered globally for `packages/design-system/*` tests — you typically should not call this directly. If a package is intentionally excluded (see `ignorePackages` in `scan-document.tsx`), opt back in by importing this and registering it in that package's jest setup.",
			'If a single test must skip the audit (long-running snapshot tests, intentional violations under review), use `skipA11yAudit()` inside that test rather than disabling the whole hook.',
		],
		keywords: ['accessibility', 'a11y', 'autoA11yCheck', 'sa11y', 'jest', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
		signature: '() => void',
	},
	{
		name: 'axe',
		description:
			'Pre-configured wrapper around `jest-axe` that runs against either a provided element/HTML string or `document.body.innerHTML` by default. Asserts no violations via `expect(...).toHaveNoViolations()` and returns the full axe results.',
		status: 'general-availability',
		usageGuidelines: [
			'Reach for `axe()` inside a specific test (e.g. after rendering a component variant) when you need a one-off accessibility assertion. For repo-wide enforcement, prefer `autoA11yCheck()`, which runs as part of the existing test lifecycle.',
			"Pass the rendered component's container rather than the whole document when possible — it keeps the audit scope tight and the error output readable.",
		],
		keywords: ['accessibility', 'a11y', 'axe', 'jest-axe', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'html',
				type: 'Element | string',
				description:
					'DOM element or HTML string to audit. Omit to scan `document.body.innerHTML` (the `region` rule is disabled in that case because most jest fixtures lack landmark roles).',
				isOptional: true,
			},
			{
				name: 'options',
				type: 'JestAxeConfigureOptions',
				description: 'Axe configuration overrides merged on top of the design-system defaults.',
				isOptional: true,
			},
		],
		returns: {
			type: 'Promise<AxeResults>',
			description: 'Resolves with the full axe results once the no-violations assertion passes.',
		},
		signature:
			'(html?: Element | string, options?: JestAxeConfigureOptions) => Promise<AxeResults>',
	},
	{
		name: 'resetA11yAuditSkip',
		description:
			'Clears the per-test skip flag set by `skipA11yAudit()`. Called automatically by the test setup so consumers rarely invoke this directly.',
		status: 'general-availability',
		usageGuidelines: [
			'Only call this manually if you are running a custom jest harness that does not already invoke `autoA11yCheck()`.',
		],
		keywords: ['accessibility', 'a11y', 'resetA11yAuditSkip', 'jest', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
		signature: '() => void',
	},
	{
		name: 'shouldSkipA11yTest',
		description:
			'Returns true when the current jest test path falls under a package that is excluded from automatic auditing (e.g. tooling-only packages with no React surface).',
		status: 'general-availability',
		usageGuidelines: [
			'Used internally by `autoA11yCheck()`. Consumers typically should not call this directly — surface a skip via `skipA11yAudit()` instead.',
		],
		keywords: ['accessibility', 'a11y', 'shouldSkipA11yTest', 'jest', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
		signature: '() => boolean',
	},
	{
		name: 'skipA11yAudit',
		description:
			'Marks the current test so that `autoA11yCheck()` skips its audit. The skip is one-shot — it is cleared by `resetA11yAuditSkip()` between tests.',
		status: 'general-availability',
		usageGuidelines: [
			'Use sparingly. Prefer fixing the violation, or scoping the test to a smaller fixture, before reaching for a skip.',
			'Always leave a comment next to the call explaining why the audit is skipped (e.g. tracked violation link or external library limitation).',
		],
		keywords: ['accessibility', 'a11y', 'skipA11yAudit', 'jest', 'testing'],
		category: 'testing',
		package: '@af/accessibility-testing',
		examples: [],
		kind: 'function',
		signature: '() => void',
	},
	{
		name: 'getSuspenseResource',
		description:
			'Creates a one-shot Suspense resource: `read()` throws a pending promise until the matching `load().complete()` or `load().fail()` is called. Use to drive a component into and out of a Suspense fallback inside a test.',
		status: 'general-availability',
		usageGuidelines: [
			'Create a fresh resource per test — the internal state machine is one-shot and asserts when `load()` is called twice.',
			'Always await `complete()` / `fail()` before making assertions about the post-fallback UI, otherwise React will not have committed the updated tree.',
		],
		keywords: ['testing', 'suspense', 'react', 'getSuspenseResource'],
		category: 'testing',
		package: '@af/react-unit-testing',
		examples: [],
		kind: 'function',
		parameters: [],
		returns: {
			type: 'TResource',
			description:
				'`{ read, load }` — `read()` is what a component calls inside render to suspend, `load()` returns `{ complete, fail }` to resolve or reject the pending promise from the test body.',
		},
		signature: '() => TResource',
	},
	{
		name: 'toBeSuspendable',
		description:
			'Jest matcher that asserts the given render thunk suspends at least once before settling. Imported for the side effect of registering itself onto `expect`.',
		status: 'general-availability',
		usageGuidelines: [
			'Pass a thunk that returns a `ReactNode` (`() => <App />`), not a component or an element directly. The matcher needs to re-invoke the thunk across renders.',
			'Import the module once from your jest setup file — the matcher self-registers on import.',
		],
		keywords: ['testing', 'jest', 'matcher', 'suspense', 'toBeSuspendable'],
		category: 'testing',
		package: '@af/react-unit-testing',
		examples: [],
		kind: 'function',
		signature: 'expect(() => ReactNode).toBeSuspendable()',
	},
	{
		name: 'toPassStrictMode',
		description:
			'Jest matcher that asserts the given component does not log any of the known React Strict Mode warnings (legacy lifecycles, legacy context, etc.).',
		status: 'general-availability',
		usageGuidelines: [
			'Run on the root component you want to certify — strict-mode warnings bubble down, so a passing root means the whole subtree is clean.',
			'Failures print the offending warning verbatim. Resolve by migrating off the deprecated API rather than suppressing the warning.',
		],
		keywords: ['testing', 'jest', 'matcher', 'strict-mode', 'toPassStrictMode'],
		category: 'testing',
		package: '@af/react-unit-testing',
		examples: [],
		kind: 'function',
		signature: 'expect(() => ReactNode).toPassStrictMode()',
	},
	{
		name: 'TResource',
		description:
			'Public shape of the value returned by `getSuspenseResource()`. Useful when stashing a resource on a ref or passing it between helpers.',
		status: 'general-availability',
		keywords: ['testing', 'suspense', 'type', 'TResource'],
		category: 'testing',
		package: '@af/react-unit-testing',
		examples: [],
		kind: 'type',
		definition:
			'type TResource = { read: () => void | never; load: () => { complete: () => Promise<void>; fail: () => Promise<void> } }',
	},
	{
		name: 'createAndFireEvent',
		description:
			'Curried helper that builds a `UIAnalyticsEvent` for a payload and fires it on a channel in one go. The original event is also returned so the call site can keep working with it.',
		status: 'general-availability',
		usageGuidelines: [
			'Reach for `createAndFireEvent` when you want a one-liner inside an event handler. For more complex flows, build and fire the event explicitly.',
		],
		keywords: ['analytics', 'utility', 'createAndFireEvent', 'analytics-next'],
		category: 'analytics',
		package: '@atlaskit/analytics-next',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'channel',
				type: 'string',
				description: 'Optional channel to fire on.',
				isOptional: true,
			},
			{
				name: 'payload',
				type: 'AnalyticsEventPayload',
			},
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
		signature:
			'(channel?: string) => (payload: AnalyticsEventPayload) => (createAnalyticsEvent: CreateUIAnalyticsEvent) => UIAnalyticsEvent',
	},
	{
		name: 'isUIAnalyticsEvent',
		description:
			'Type-guard that returns true if the given value is a `UIAnalyticsEvent` (including instances from older copies of `analytics-next`).',
		status: 'general-availability',
		usageGuidelines: [
			'Use in listener handlers when you receive events from third-party code and need to narrow before reading `.payload`.',
		],
		keywords: ['analytics', 'guard', 'isUIAnalyticsEvent', 'analytics-next'],
		category: 'analytics',
		package: '@atlaskit/analytics-next',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'obj',
				type: 'unknown',
			},
		],
		returns: {
			type: 'boolean',
		},
		signature: '(obj: unknown) => obj is UIAnalyticsEvent',
	},
	{
		name: 'UIAnalyticsEventHandler',
		description:
			'Signature for any function that receives events from an `AnalyticsListener`. Implement to forward events to your analytics SDK.',
		status: 'general-availability',
		usageGuidelines: [
			'Handlers must not throw — analytics must never crash product UI. The runtime swallows handler errors in production and logs them in development.',
		],
		keywords: ['analytics', 'type', 'handler', 'UIAnalyticsEventHandler', 'analytics-next'],
		category: 'analytics',
		package: '@atlaskit/analytics-next',
		examples: [],
		kind: 'type',
		definition: '(event: UIAnalyticsEvent, channel?: string) => void',
	},
	{
		name: 'quickInsertPlugin',
		description: 'Quick insert plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-quick-insert', 'atlaskit'],
		category: 'editor',
		package: '@atlaskit/editor-plugin-quick-insert',
		examples: [],
		kind: 'function',
		signature: 'quickInsertPlugin: QuickInsertPlugin',
	},
	{
		name: 'CustomAttributes',
		description:
			'Free-form attribute bag attached to an exposure event. Keys are validated against the reserved-attribute list at runtime — colliding with a reserved key throws.',
		status: 'general-availability',
		usageGuidelines: [
			'Keep custom attribute names stable — downstream analytics queries pivot on them. Coordinate any rename with the data-platform team before shipping.',
		],
		keywords: ['feature-flag', 'type', 'CustomAttributes', 'exposure'],
		category: 'experimentation',
		package: '@atlaskit/feature-flag-client',
		examples: [],
		kind: 'type',
		definition:
			'type CustomAttributes = { [attributeName: string]: string | number | boolean | object }',
	},
	{
		name: 'ExposureTriggerReason',
		description:
			'Enum describing why an exposure event was fired (auto vs. manual vs. consumer opt-in). Surfaced on the exposure event payload so downstream analytics can de-duplicate auto vs. manual fires.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the enum members rather than literal strings when calling `trackFeatureFlag({ triggerReason })` — the literal values change if the backend renames a reason.',
		],
		keywords: ['feature-flag', 'exposure', 'enum', 'ExposureTriggerReason'],
		category: 'experimentation',
		package: '@atlaskit/feature-flag-client',
		examples: [],
		kind: 'constant',
		type: 'enum ExposureTriggerReason',
		value:
			'{ OptIn = "optInExposure", Manual = "manualExposure", Default = "defaultExposure", AutoExposure = "autoExposure", hasCustomAttributes = "hasCustomAttributes" }',
	},
	{
		name: 'FeatureFlagClient',
		description:
			'Default export. The runtime client developers construct and interact with — it evaluates flags from an in-memory flag set, caches per-key flag wrappers, and fires exposure events through the supplied analytics handler. Construct one instance per app bootstrap and pass it through context.',
		status: 'general-availability',
		usageGuidelines: [
			'Construct one client per app and pass it through context — do not new up additional clients per component, or duplicate exposures will fire.',
			'Provide an `analyticsHandler` at construction time. Constructing without one is an error: the client will throw via `enforceAttributes`.',
			'`isAutomaticExposuresEnabled` enables the TAC auto-exposure pipeline (downstream consumers opt in). `ignoreTypes: true` disables the runtime type guard on evaluation — only set in tests.',
			'Prefer the typed value getters (`getBooleanValue`, `getVariantValue`, `getJSONValue`) over `getRawValue` so wrong-type explanations land in the exposure event.',
			'`getJSONValue` does not fire an exposure — pair it with `trackFeatureFlag` if the consumer needs an exposure event for the JSON read.',
			'If you need to short-circuit exposure firing (e.g. evaluate-then-decide flows), use `shouldTrackExposureEvent: false` paired with an explicit `trackFeatureFlag` call once the decision is made.',
			'`setFlags` replaces or extends the in-memory flag set and invalidates cached wrappers for any keys it touches; safe to call after a late-arriving bootstrap payload.',
			'`clear` drops the entire flag set, wrapper cache, and tracked-flag set — primarily useful in tests or when re-bootstrapping after a tenant switch.',
		],
		keywords: [
			'feature-flag',
			'feature-gate',
			'experiment',
			'switcheroo',
			'FeatureFlagClient',
			'client',
		],
		category: 'experimentation',
		package: '@atlaskit/feature-flag-client',
		examples: [],
		kind: 'constant',
		type: 'class FeatureFlagClient',
		value:
			'new FeatureFlagClient({ analyticsHandler, flags?, isAutomaticExposuresEnabled?, ignoreTypes? })\n  .setFlags(flags: Flags): void\n  .setAnalyticsHandler(analyticsHandler?: AnalyticsHandler): void\n  .setIsAutomaticExposuresEnabled(isEnabled: boolean): void\n  .getBooleanValue(flagKey, { default, exposureData?, shouldTrackExposureEvent? }): boolean\n  .getVariantValue(flagKey, { default, oneOf, exposureData?, shouldTrackExposureEvent? }): string\n  .getJSONValue(flagKey): object\n  .getRawValue(flagKey, { default, exposureData?, shouldTrackExposureEvent? }): FlagValue\n  .getFlagEvaluation<T>(flagKey, { default, exposureData?, shouldTrackExposureEvent? }): FlagShape<T>\n  .trackFeatureFlag(flagKey, options?: TrackFeatureFlagOptions): void\n  .clear(): void',
	},
	{
		name: 'FlagValue',
		description: 'Union of the value types a flag can return: `boolean | string | object`.',
		status: 'general-availability',
		keywords: ['feature-flag', 'type', 'FlagValue'],
		category: 'experimentation',
		package: '@atlaskit/feature-flag-client',
		examples: [],
		kind: 'type',
		definition: 'type FlagValue = boolean | string | object',
	},
	{
		name: 'convertToError',
		description:
			'Normalises any value thrown by a `try`/`catch` into an `Error` instance — useful at the boundary between untyped JS code (which can throw strings, objects, or `undefined`) and TypeScript code that wants a real `Error`.',
		status: 'general-availability',
		usageGuidelines: [
			'Use at every catch boundary that hands the error to logging, Sentry, or analytics — those consumers all assume a real `Error` with `.message` and a stack.',
			'Object errors are JSON-serialised; circular objects fall back to `String(...)`, so the stack you log will reflect where `convertToError` was called, not where the original value was thrown.',
		],
		keywords: ['utility', 'convertToError', 'error', 'frontend-utilities'],
		category: 'utilities',
		package: '@atlaskit/frontend-utilities',
		examples: [],
		kind: 'function',
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
		signature: '(e: unknown) => Error',
	},
	{
		name: 'mockWindowStorage',
		description:
			'Test helper that replaces `window.localStorage` and/or `window.sessionStorage` with an in-memory `STORAGE_MOCK` so unit tests can exercise storage-dependent code without touching the real browser storage (and without crashing in jsdom environments where storage may be disabled).',
		status: 'general-availability',
		usageGuidelines: [
			'Call once per test (in `beforeEach`) — each call installs a fresh `STORAGE_MOCK`, so tests are isolated.',
			'Handles SSR/jsdom environments where `window` may be undefined — safe to call in any Jest test.',
			'Production code must never call this. It is wired up under the `./local-storage` subpath alongside the test mock.',
		],
		keywords: ['utility', 'mockWindowStorage', 'storage', 'test', 'frontend-utilities'],
		category: 'utilities',
		package: '@atlaskit/frontend-utilities',
		examples: [],
		kind: 'function',
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
		signature: "(storageToMock?: ('localStorage' | 'sessionStorage')[]) => void",
	},
	{
		name: 'retryOnException',
		description:
			'Retries an async `invokeOperation` while the most recent error is in the `retryOn` allow-list, sleeping between attempts per `intervalsMS`. The sleep schedule defines both the number of retries and the delays between them — `intervalsMS: [0, 50, 100]` means "try once, then up to three retries at 0 ms, 50 ms, and 100 ms".',
		status: 'general-availability',
		usageGuidelines: [
			'Pre-baked schedules live in `@atlaskit/frontend-utilities/retry-operation`: `NO_RETRIES`, `UP_TO_TWO_INSTANT_RETRIES`, `DEFAULT_RETRIES` (`[0, 50, 100]`), `LAZY_LOAD_RETRIES` (`[100, 500, 1000]`). Prefer one of those over hand-rolled arrays so retry semantics stay consistent across products.',
			'`retryOn` is allow-list, not deny-list — unmatched errors short-circuit and reject immediately. Throw `FailedFetchError` (or your own type that extends `Error`) from inside `invokeOperation` to opt into retries.',
			'`captureException` should fire-and-forget — do not throw from it, or the retry loop bails. Use it for Sentry reporting on every attempt.',
		],
		keywords: ['utility', 'retryOnException', 'retry', 'fetch', 'frontend-utilities'],
		category: 'utilities',
		package: '@atlaskit/frontend-utilities',
		examples: [],
		kind: 'function',
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
		signature: '<T>(invokeOperation: () => Promise<T>, config: RetryConfig) => Promise<T>',
	},
	{
		name: 'simpleHash',
		description:
			'Deterministic 32-bit string hash rendered in base-36 (e.g. `"hello" -> "y2sl1f"`). Stable across runs for the same input. NOT cryptographic — collisions are easy and the algorithm is not suitable for security.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for stable cache keys, telemetry-bucket assignments, or generating short anonymous identifiers from a known input.',
			'Do NOT use for password hashing, signing, or anything else where collisions or pre-image resistance matter.',
			'Output is stable across runtimes — safe to embed in URLs and analytics events.',
		],
		keywords: ['utility', 'simpleHash', 'hash', 'frontend-utilities'],
		category: 'utilities',
		package: '@atlaskit/frontend-utilities',
		examples: [],
		kind: 'function',
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
		signature: '(str: string) => string',
	},
	{
		name: 'STORAGE_MOCK',
		description:
			'In-memory implementation of the DOM `Storage` interface used by `mockWindowStorage`. Exported directly so tests that need their own scoped mock (e.g. for `globalThis` shimming or browser-extension storage) can use it as a building block.',
		status: 'general-availability',
		usageGuidelines: [
			'Prefer `mockWindowStorage()` for typical Jest setups. Reach for `STORAGE_MOCK` directly only when you need to install storage somewhere other than `window` (e.g. a worker global).',
			'The mock is mutable and shared — wrap it with `{ ...STORAGE_MOCK }` before installing if you want per-test isolation manually.',
		],
		keywords: ['constant', 'STORAGE_MOCK', 'storage', 'test', 'frontend-utilities'],
		category: 'utilities',
		package: '@atlaskit/frontend-utilities',
		examples: [],
		kind: 'constant',
		type: 'Storage',
		value:
			'{ length: 0; getItem(id); setItem(id, val); removeItem(id); clear(); key(index) } — backed by an in-memory `_data` record.',
	},
	{
		name: 'init',
		description: 'INSM tooling measures user-perceived interactivity of a page',
		status: 'general-availability',
		usageGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'insm', 'atlaskit'],
		category: 'editor',
		package: '@atlaskit/insm',
		examples: [],
		kind: 'function',
		signature: 'init(options: INSMOptions): void',
	},
	{
		name: 'BaseUrls',
		description:
			'Record of resolver environments to Stargate base URLs. Three production aliases (`prd`, `prod`, `production`) all map to the same host; the same goes for `dev` / `development` and `stg` / `staging`. Underlying source of truth for `getBaseUrl`; exported for tests and downstream packages that need to match on the host.',
		status: 'general-availability',
		usageGuidelines: [
			'Prefer calling `getBaseUrl(envKey)` at runtime instead of indexing this constant directly — the runtime path picks up env-detection overrides for tests and SSR.',
		],
		keywords: ['constant', 'BaseUrls', 'environment', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'constant',
		type: "Record<'dev' | 'development' | 'stg' | 'staging' | 'prd' | 'prod' | 'production', string>",
	},
	{
		name: 'cardAction',
		description:
			'Action creator for the Smart Card Redux store. Builds a `CardAction<T>` from an action type and a `{ url }` params object, plus optional payload, error, metadata status, and an `ignoreStatusCheck` flag that forces the reducer to apply the action regardless of the current/next status. Use the exported `ACTION_*` constants for the `type` argument.',
		status: 'general-availability',
		usageGuidelines: [
			'Always use the `ACTION_*` constants exported alongside `cardAction` instead of typing the string literal — adding a new action type then forces a TypeScript update at every dispatch site.',
			'`ignoreStatusCheck: true` bypasses the reducer guard — use only when you genuinely need to override the FSM, e.g. forcing a reload from outside the store.',
		],
		keywords: ['utility', 'cardAction', 'redux', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'type',
				type: 'CardActionType',
			},
			{
				name: 'params',
				type: '{ url: string }',
				description: 'Card key (URL).',
			},
			{
				name: 'payload',
				type: 'T',
				isOptional: true,
			},
			{
				name: 'error',
				type: 'APIError',
				isOptional: true,
			},
			{
				name: 'metadataStatus',
				type: 'MetadataStatus',
				description: 'Hover-preview metadata fetch status.',
				isOptional: true,
			},
			{
				name: 'ignoreStatusCheck',
				type: 'boolean',
				description:
					'Forces the reducer to apply the action regardless of the current/next status transition.',
				isOptional: true,
			},
		],
		returns: {
			type: 'CardAction<T>',
		},
		signature:
			'<T = JsonLd.Response>(type: CardActionType, params: { url: string }, payload?: T, error?: APIError, metadataStatus?: MetadataStatus, ignoreStatusCheck?: boolean) => CardAction<T>',
	},
	{
		name: 'CardAction',
		description:
			'Redux action shape for the Smart Card store. Extends `AnyAction` with `type: CardActionType`, the card key `url`, an optional response `payload`, and an optional `metadataStatus`. Use the `cardAction` action creator to construct values rather than building this type by hand.',
		status: 'general-availability',
		keywords: ['type', 'CardAction', 'redux', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'type',
		definition:
			'interface CardAction<T = JsonLd.Response> extends AnyAction { type: CardActionType; url: string; payload?: T; metadataStatus?: MetadataStatus }',
	},
	{
		name: 'CardActions',
		description:
			'Family of action-type string constants exported alongside `cardAction`. Use these instead of string literals when dispatching to or reducing from the Smart Card store. Note that the constant **names** and **string values** diverge in a few places (e.g. `ACTION_ERROR === "errored"`, `ACTION_ERROR_FALLBACK === "fallback"`, `ACTION_UPDATE_METADATA_STATUS === "metadata"`) — always import the constants rather than typing the string.',
		status: 'general-availability',
		usageGuidelines: [
			"Always import the constants rather than typing the string — the constant names and the underlying values do not always match (e.g. `ACTION_ERROR === 'errored'`).",
			'`ACTION_RELOADING` is distinct from `ACTION_RESOLVING`: reloading happens when an already-resolved card refreshes; resolving is the first-time fetch.',
			'`ACTION_PRELOAD` is not in `CardActionType` — it is a Smart Card store-internal action that exists alongside the typed action set.',
		],
		keywords: ['constant', 'CardActions', 'redux', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'constant',
		type: 'CardActionType (extended)',
		value:
			"ACTION_PENDING === 'pending'\nACTION_RESOLVING === 'resolving'\nACTION_RESOLVED === 'resolved'\nACTION_RELOADING === 'reloading'\nACTION_ERROR === 'errored'\nACTION_ERROR_FALLBACK === 'fallback'\nACTION_PRELOAD === 'preload'\nACTION_UPDATE_METADATA_STATUS === 'metadata'",
	},
	{
		name: 'CardAppearance',
		description:
			'Discriminator for how a Smart Link should render: `inline` (chip inside text), `block` (single-line block card), or `embed` (rich preview embed). Used by ADF and by consumer props.',
		status: 'general-availability',
		keywords: ['type', 'CardAppearance', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'type',
		definition: "type CardAppearance = 'inline' | 'block' | 'embed'",
	},
	{
		name: 'CardType',
		description:
			'Lifecycle status of a Smart Card store entry. Returned by `getStatus` and stored on `CardState.status`. Drives the choice between skeleton, content, error, fallback, unauthorised, forbidden, and not-found renderings.',
		status: 'general-availability',
		keywords: ['type', 'CardType', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'type',
		definition:
			"type CardType = 'pending' | 'resolving' | 'resolved' | 'errored' | 'fallback' | 'unauthorized' | 'forbidden' | 'not_found'",
	},
	{
		name: 'Datasource',
		description:
			'Public contract for a Datasource node — id, parameters bag (generic, defaults to `Record<string, unknown>`), and the view configs that describe how the resolved rows should render. Exchanged between the editor, Confluence/Jira renderers, and the resolver.',
		status: 'general-availability',
		keywords: ['type', 'Datasource', 'datasource', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'type',
		definition:
			'interface Datasource<P extends Record<string, unknown> = Record<string, unknown>> { id: string; parameters: P; views: DatasourceAdfView[] }',
	},
	{
		name: 'DATASOURCE_DEFAULT_LAYOUT',
		description:
			'Default ADF layout applied to a Datasource node when no explicit layout is provided. Pinned constant so Confluence, Jira, and the editor render identical defaults.',
		status: 'general-availability',
		keywords: ['constant', 'DATASOURCE_DEFAULT_LAYOUT', 'datasource', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'constant',
		type: "'wide'",
		value: "'wide'",
	},
	{
		name: 'EnvironmentsKeys',
		description:
			'String union of the resolver environments understood by `getBaseUrl` / `getResolverUrl`. Three environments with two-or-three aliases each (`dev` / `development`, `stg` / `staging`, `prd` / `prod` / `production`), plus a special `custom` value that pairs with the `baseUrlOverride` arg for SSR / non-standard hosts.',
		status: 'general-availability',
		keywords: ['type', 'EnvironmentsKeys', 'environment', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'type',
		definition:
			"type EnvironmentsKeys = 'dev' | 'development' | 'stg' | 'staging' | 'prd' | 'prod' | 'production' | 'custom'",
	},
	{
		name: 'filterSiteProducts',
		description:
			'Curried predicate factory. Given a list of products to require, returns a `(site: AvailableSite) => boolean` that keeps sites whose `products` overlap with the required list. Used by the link picker to limit results to sites the user can actually use for the target product.',
		status: 'general-availability',
		keywords: ['utility', 'filterSiteProducts', 'sites', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'availableSitesProducts',
				type: 'AvailableSitesProductType[]',
				description: 'Products to require; site is kept if it has at least one of them.',
			},
		],
		returns: {
			type: '(site: AvailableSite) => boolean',
			description: 'Predicate suitable for `Array.prototype.filter`.',
		},
		signature:
			'(availableSitesProducts: AvailableSitesProductType[]) => (site: AvailableSite) => boolean',
	},
	{
		name: 'getBaseUrl',
		description:
			'Resolves the Atlassian gateway base URL for the given environment. Maps `dev`/`development`, `stg`/`staging`, and `prd`/`prod`/`production` to the matching Stargate host. With `envKey === "custom"` it returns `baseUrlOverride` (or prod as a fallback); with no `envKey` and no override it returns `window.location.origin` so calls flow through the Edge Proxy on the current host.',
		status: 'general-availability',
		keywords: ['utility', 'getBaseUrl', 'environment', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'envKey',
				type: 'EnvironmentsKeys',
				isOptional: true,
			},
			{
				name: 'baseUrlOverride',
				type: 'string',
				description: 'Only honoured when `envKey === "custom"`.',
				isOptional: true,
			},
		],
		returns: {
			type: 'string',
		},
		signature: '(envKey?: EnvironmentsKeys, baseUrlOverride?: string) => string',
	},
	{
		name: 'getResolverUrl',
		description:
			'Returns the object-resolver service URL for the given environment. With no args it returns the Edge Proxy path `/gateway/api/object-resolver` (which fixes cookie issues with strict browser policies); with `envKey` or `baseUrlOverride` it returns the Stargate-direct URL via `getBaseUrl`; with `envKey === "custom"` it returns `baseUrlOverride` (or the Edge Proxy path as a fallback).',
		status: 'general-availability',
		usageGuidelines: [
			'Prefer the no-args form in the browser — it routes through the Edge Proxy and works correctly with third-party cookie restrictions.',
			'Pass `envKey` only when you need to talk to a non-production environment from a different origin (e.g. SSR).',
		],
		keywords: ['utility', 'getResolverUrl', 'resolver', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'envKey',
				type: 'EnvironmentsKeys',
				isOptional: true,
			},
			{
				name: 'baseUrlOverride',
				type: 'string',
				isOptional: true,
			},
		],
		returns: {
			type: 'string',
		},
		signature: '(envKey?: EnvironmentsKeys, baseUrlOverride?: string) => string',
	},
	{
		name: 'getStatus',
		description:
			'Derives a `CardType` (Smart Card lifecycle status) from the JSON-LD response meta returned by the resolver. Maps `access: "forbidden"` + `visibility: "not_found"` to either `"not_found"` or `"forbidden"` based on the `requestAccess.accessType`, `access: "unauthorized"` to `"unauthorized"`, and everything else to `"resolved"`.',
		status: 'general-availability',
		usageGuidelines: [
			'Use anywhere you derive a Smart Card UI state from a fresh resolver response — keeps the access/visibility narrowing in one place.',
			'For state already in the Smart Card store (i.e. you already have a `CardState`), read `state.status` directly instead of recomputing.',
		],
		keywords: ['utility', 'getStatus', 'smart-card', 'json-ld', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'meta',
				type: "JsonLd.Response['meta']",
				description: 'The `meta` block from the resolver response.',
			},
		],
		returns: {
			type: 'CardType',
		},
		signature: "({ meta }: { meta: JsonLd.Response['meta'] }) => CardType",
	},
	{
		name: 'getUrl',
		description:
			'Selector that pulls the `CardState` for a given URL out of the Smart Card Redux store. Returns `{ status: "pending" }` as a default when no entry exists yet, so consumers can render their pending UI without an explicit null check.',
		status: 'general-availability',
		keywords: ['utility', 'getUrl', 'redux', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'store',
				type: 'Store<CardStore>',
			},
			{
				name: 'url',
				type: 'string',
				description: 'Card key (URL).',
			},
		],
		returns: {
			type: 'CardState',
		},
		signature: '(store: Store<CardStore>, url: string) => CardState',
	},
	{
		name: 'InlineCardAdf',
		description:
			'ADF node shape for inline Smart Links. Sister types `BlockCardAdf`, `EmbedCardAdf`, and `DatasourceAdf` cover the other appearances. Together `InlineCardAdf | BlockCardAdf | EmbedCardAdf` form `CardAdf`, the union accepted by `@atlaskit/editor-common-types` for Smart Link nodes.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `CardAdf` when you need to accept any inline/block/embed Smart Link node and the appearance-specific types when you need to discriminate.',
			'`DatasourceAdf` is structurally a `blockCard` but with a `datasource` attribute — use it explicitly rather than `BlockCardAdf` when working with datasources.',
		],
		keywords: ['type', 'InlineCardAdf', 'adf', 'smart-card', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'type',
		definition: "interface InlineCardAdf { type: 'inlineCard'; attrs: { url: string } }",
	},
	{
		name: 'promiseDebounce',
		description:
			'Higher-order helper that returns a debounced wrapper around an async function. Each call cancels the previous pending timeout, so only the final invocation within `time` ms actually runs `cb`. Earlier callers receive promises that remain **pending forever** — they are never rejected.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for "search-as-you-type" against the resolver — each keystroke gets a promise, but only the last keystroke actually hits the network.',
			"Earlier callers' promises **stay pending forever** — do not `await` them in a context where you also depend on them rejecting (e.g. with `Promise.race`).",
			'Only one timeout is tracked per wrapped function; calls from different callers share the same debounce window.',
		],
		keywords: ['utility', 'promiseDebounce', 'debounce', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'cb',
				type: '(...args: Args) => Promise<ResolveType>',
			},
			{
				name: 'time',
				type: 'number',
				description: 'Debounce window in ms.',
			},
		],
		returns: {
			type: '(...args: Args) => Promise<ResolveType>',
		},
		signature:
			'<Args extends unknown[], ResolveType>(cb: (...args: Args) => Promise<ResolveType>, time: number) => (...args: Args) => Promise<ResolveType>',
	},
	{
		name: 'request',
		description:
			'Thin `fetch` wrapper that talks to the linking resolver / ORS. Sets the standard JSON headers, `credentials: "include"`, and only accepts responses whose status is OK or appears in the `statuses` allow-list (default `[200, 401, 404]`). Other statuses cause the raw `Response` to be thrown; string errors and `TypeError`s from the network layer are normalised into a `NetworkError`. Caller is responsible for building the full URL (typically via `getResolverUrl`).',
		status: 'general-availability',
		usageGuidelines: [
			'Use for any call that targets the linking resolver — do not reach for raw `fetch` so credential and header handling stays consistent.',
			'When checking errors, narrow against `NetworkError` first, then handle the `Response` case for non-allow-listed statuses.',
			'`data` is JSON-stringified unconditionally — do not pass `FormData` or other body types.',
		],
		keywords: ['utility', 'request', 'fetch', 'resolver', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'method',
				type: 'string',
				description: 'HTTP method.',
			},
			{
				name: 'url',
				type: 'string',
				description: 'Fully-qualified URL — typically built with `getResolverUrl`.',
			},
			{
				name: 'data',
				type: 'any',
				description: 'JSON-serialised into the request body when present.',
				isOptional: true,
			},
			{
				name: 'headers',
				type: 'HeadersInit',
				description: 'Additional headers — merged on top of the defaults.',
				isOptional: true,
			},
			{
				name: 'statuses',
				type: 'number[]',
				description:
					'Allow-list of non-OK status codes that should still resolve (with the parsed body) rather than throw. Defaults to `[200, 401, 404]`. Include `204` if the response may have an empty body.',
				isOptional: true,
			},
		],
		returns: {
			type: 'Promise<T>',
			description:
				'Resolves with the parsed JSON body. Rejects with `NetworkError` for string errors / `TypeError` (typically network failures), or with the raw `Response` for unexpected status codes.',
		},
		signature:
			'<T = JsonLd.Response>(method: string, url: string, data?: any, headers?: HeadersInit, statuses?: number[]) => Promise<T>',
	},
	{
		name: 'withFeatureFlaggedComponent',
		description:
			'Higher-order component that swaps between two implementations based on a feature-gate function. Lets a package ship a new component behind a gate without forking the consuming call sites. The gate function is invoked per render — pass `() => fg("my_gate_name")`.',
		status: 'general-availability',
		usageGuidelines: [
			'`featureFlagFn` is a callback, not a string — it lets the wrapper stay agnostic to which flag system you use (`fg`, Statsig, etc.).',
			'Argument order is `(Old, New, gateFn)` — the old component first matches the migration mental model.',
			'Test both branches with `passGate` / `failGate` from `@atlassian/feature-flags-test-utils/mock-gates`.',
			'Keep both implementations source-compatible — props must be the same shape, or the swap will break call sites.',
		],
		keywords: ['utility', 'withFeatureFlaggedComponent', 'feature-flag', 'hoc', 'linking-common'],
		category: 'linking',
		package: '@atlaskit/linking-common',
		examples: [],
		kind: 'function',
		parameters: [
			{
				name: 'ComponentOld',
				type: 'ComponentType<P>',
			},
			{
				name: 'ComponentNext',
				type: 'ComponentType<P>',
			},
			{
				name: 'featureFlagFn',
				type: '() => boolean',
				description: 'Evaluated each render. Typically `() => fg("gate_name")`.',
			},
		],
		returns: {
			type: '(props: P) => JSX.Element',
		},
		signature:
			'<P extends object>(ComponentOld: ComponentType<P>, ComponentNext: ComponentType<P>, featureFlagFn: () => boolean) => (props: P) => JSX.Element',
	},
];

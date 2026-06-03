/**
 * Structured MCP docs for `@atlaskit/linking-common`.
 *
 * ⚠️ Pilot / not yet final. This file is part of the libraries-content pilot
 * for the "Libraries, hooks, utilities in structured content" RFC. The
 * container schema and per-kind shapes are still in review — expect breaking
 * changes before this is rolled out broadly. Do not depend on the format yet.
 *
 * Non-ADS pilot. The connective tissue of the Linking Platform: Smart Link
 * skeleton/animation components, the resolver HTTP `request` helper, the
 * action-type constants and `cardAction` action creator shared between the
 * Smart Card store and its consumers, environment-aware resolver URL
 * builders, and the public type contract for ADF nodes / Card props. This is
 * the canonical "components + utilities (function + constant + type)"
 * example — there are no hooks in the public surface, so the file exercises
 * four of the five top-level kinds.
 *
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/linking-common',
		packagePath,
		packageJson,
		overview:
			'Utilities and interfaces shared across the Linking Platform — Smart Cards, Smart Links, Datasources, the link picker, and the resolver client. Exposes a small set of presentation primitives (`Pulse`, `Skeleton`), an HTTP `request` helper hardened for the resolver service, the Smart Card Redux action-type constants and a `cardAction` action creator, environment-aware resolver URL builders, and the public type contract used by ADF nodes (`InlineCardAdf`, `BlockCardAdf`, `EmbedCardAdf`, `DatasourceAdf`) and consumer props (`CardAppearance`, `CardType`, `CardAction`). Consumed by `smart-card`, `link-picker`, `link-datasource`, `link-create`, and downstream products including Confluence and Jira.',
	},
	components: [
		{
			name: 'Pulse',
			description:
				'Wrapper that applies a single brief box-shadow pulse animation (3 iterations, ~1.45s each, using the bold discovery design token) to its child. Used to draw attention to a freshly-inserted Smart Link or discovery affordance. Once `showPulse` flips true, the animation persists across rerenders even if `showPulse` flips back — the wrapper latches a ref so the animation runs to completion.',
			status: 'general-availability',
			import: {
				name: 'Pulse',
				package: '@atlaskit/linking-common',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use sparingly — overusing the pulse defeats its purpose as an attention-grabber. Trigger only on genuinely new content, not on every render.',
				'Pass `isInline` for inline contexts (uses `<span>`); the default wraps in `<div>`.',
				'Hook into `onAnimationStart` / `onAnimationIteration` if you need to fire analytics on first paint vs. each pulse iteration.',
			],
			accessibilityGuidelines: [
				'Pulse is decorative — do not rely on it alone to convey state. Ensure the wrapped element still has an accessible name and role.',
				'Respect `prefers-reduced-motion` at the call site (the component itself does not).',
			],
			keywords: ['linking-common', 'pulse', 'animation', 'discovery'],
			categories: ['linking', 'animation'],
			examples: [],
		},
		{
			name: 'Skeleton',
			description:
				'Generic block-level loading skeleton used by Smart Card and Datasource UIs while a resolver response is pending. Supports three appearances (`gray`, `blue`, `darkGray`), explicit `width` / `height` / `borderRadius` props, and an optional shimmer animation toggled by `isShimmering`.',
			status: 'general-availability',
			import: {
				name: 'Skeleton',
				package: '@atlaskit/linking-common',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use for Smart Card / Datasource loading states — not as a general-purpose `<Skeleton>` primitive (the design system\'s `@atlaskit/skeleton` package owns that).',
				'Match the skeleton dimensions to the eventual content to avoid layout shift on resolve.',
			],
			accessibilityGuidelines: [
				'Skeletons must not announce themselves to assistive tech as content. Pair with `aria-busy="true"` on the container that owns the loading state.',
			],
			keywords: ['linking-common', 'skeleton', 'loading', 'placeholder'],
			categories: ['linking', 'loading'],
			examples: [],
		},
		{
			name: 'SpanSkeleton',
			description:
				'Inline variant of `Skeleton` (renders a `<span>`) for use inside text flows — e.g. while a Smart Link title resolves inside a paragraph. Same prop shape as `Skeleton`.',
			status: 'general-availability',
			import: {
				name: 'SpanSkeleton',
				package: '@atlaskit/linking-common',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use only when the placeholder needs to flow with surrounding text. For block-level cards reach for `Skeleton`.',
			],
			accessibilityGuidelines: [
				'Same as `Skeleton` — pair with `aria-busy` on the parent that owns the resolving state. Never put the skeleton itself in the accessible name.',
			],
			keywords: ['linking-common', 'skeleton', 'inline', 'loading'],
			categories: ['linking', 'loading'],
			examples: [],
		},
	],
	utilities: [
		{
			kind: 'function',
			name: 'request',
			description:
				'Thin `fetch` wrapper that talks to the linking resolver / ORS. Sets the standard JSON headers, `credentials: "include"`, and only accepts responses whose status is OK or appears in the `statuses` allow-list (default `[200, 401, 404]`). Other statuses cause the raw `Response` to be thrown; string errors and `TypeError`s from the network layer are normalised into a `NetworkError`. Caller is responsible for building the full URL (typically via `getResolverUrl`).',
			status: 'general-availability',
			signature:
				'<T = JsonLd.Response>(method: string, url: string, data?: any, headers?: HeadersInit, statuses?: number[]) => Promise<T>',
			parameters: [
				{ name: 'method', type: 'string', description: 'HTTP method.' },
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
			usageGuidelines: [
				'Use for any call that targets the linking resolver — do not reach for raw `fetch` so credential and header handling stays consistent.',
				'When checking errors, narrow against `NetworkError` first, then handle the `Response` case for non-allow-listed statuses.',
				'`data` is JSON-stringified unconditionally — do not pass `FormData` or other body types.',
			],
			keywords: ['utility', 'request', 'fetch', 'resolver', 'linking-common'],
			categories: ['linking', 'network', 'utilities'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'promiseDebounce',
			description:
				'Higher-order helper that returns a debounced wrapper around an async function. Each call cancels the previous pending timeout, so only the final invocation within `time` ms actually runs `cb`. Earlier callers receive promises that remain **pending forever** — they are never rejected.',
			status: 'general-availability',
			signature:
				'<Args extends unknown[], ResolveType>(cb: (...args: Args) => Promise<ResolveType>, time: number) => (...args: Args) => Promise<ResolveType>',
			parameters: [
				{ name: 'cb', type: '(...args: Args) => Promise<ResolveType>' },
				{ name: 'time', type: 'number', description: 'Debounce window in ms.' },
			],
			returns: { type: '(...args: Args) => Promise<ResolveType>' },
			usageGuidelines: [
				'Use for "search-as-you-type" against the resolver — each keystroke gets a promise, but only the last keystroke actually hits the network.',
				'Earlier callers\' promises **stay pending forever** — do not `await` them in a context where you also depend on them rejecting (e.g. with `Promise.race`).',
				'Only one timeout is tracked per wrapped function; calls from different callers share the same debounce window.',
			],
			keywords: ['utility', 'promiseDebounce', 'debounce', 'linking-common'],
			categories: ['linking', 'utilities', 'async'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'getStatus',
			description:
				'Derives a `CardType` (Smart Card lifecycle status) from the JSON-LD response meta returned by the resolver. Maps `access: "forbidden"` + `visibility: "not_found"` to either `"not_found"` or `"forbidden"` based on the `requestAccess.accessType`, `access: "unauthorized"` to `"unauthorized"`, and everything else to `"resolved"`.',
			status: 'general-availability',
			signature:
				"({ meta }: { meta: JsonLd.Response['meta'] }) => CardType",
			parameters: [
				{
					name: 'meta',
					type: "JsonLd.Response['meta']",
					description: 'The `meta` block from the resolver response.',
				},
			],
			returns: { type: 'CardType' },
			usageGuidelines: [
				'Use anywhere you derive a Smart Card UI state from a fresh resolver response — keeps the access/visibility narrowing in one place.',
				'For state already in the Smart Card store (i.e. you already have a `CardState`), read `state.status` directly instead of recomputing.',
			],
			keywords: ['utility', 'getStatus', 'smart-card', 'json-ld', 'linking-common'],
			categories: ['linking', 'utilities', 'smart-card'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'getBaseUrl',
			description:
				'Resolves the Atlassian gateway base URL for the given environment. Maps `dev`/`development`, `stg`/`staging`, and `prd`/`prod`/`production` to the matching Stargate host. With `envKey === "custom"` it returns `baseUrlOverride` (or prod as a fallback); with no `envKey` and no override it returns `window.location.origin` so calls flow through the Edge Proxy on the current host.',
			status: 'general-availability',
			signature: '(envKey?: EnvironmentsKeys, baseUrlOverride?: string) => string',
			parameters: [
				{ name: 'envKey', type: 'EnvironmentsKeys', isOptional: true },
				{
					name: 'baseUrlOverride',
					type: 'string',
					description: 'Only honoured when `envKey === "custom"`.',
					isOptional: true,
				},
			],
			returns: { type: 'string' },
			keywords: ['utility', 'getBaseUrl', 'environment', 'linking-common'],
			categories: ['linking', 'utilities', 'network'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'getResolverUrl',
			description:
				'Returns the object-resolver service URL for the given environment. With no args it returns the Edge Proxy path `/gateway/api/object-resolver` (which fixes cookie issues with strict browser policies); with `envKey` or `baseUrlOverride` it returns the Stargate-direct URL via `getBaseUrl`; with `envKey === "custom"` it returns `baseUrlOverride` (or the Edge Proxy path as a fallback).',
			status: 'general-availability',
			signature: '(envKey?: EnvironmentsKeys, baseUrlOverride?: string) => string',
			parameters: [
				{ name: 'envKey', type: 'EnvironmentsKeys', isOptional: true },
				{ name: 'baseUrlOverride', type: 'string', isOptional: true },
			],
			returns: { type: 'string' },
			usageGuidelines: [
				'Prefer the no-args form in the browser — it routes through the Edge Proxy and works correctly with third-party cookie restrictions.',
				'Pass `envKey` only when you need to talk to a non-production environment from a different origin (e.g. SSR).',
			],
			keywords: ['utility', 'getResolverUrl', 'resolver', 'linking-common'],
			categories: ['linking', 'utilities', 'network'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'filterSiteProducts',
			description:
				'Curried predicate factory. Given a list of products to require, returns a `(site: AvailableSite) => boolean` that keeps sites whose `products` overlap with the required list. Used by the link picker to limit results to sites the user can actually use for the target product.',
			status: 'general-availability',
			signature:
				'(availableSitesProducts: AvailableSitesProductType[]) => (site: AvailableSite) => boolean',
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
			keywords: ['utility', 'filterSiteProducts', 'sites', 'linking-common'],
			categories: ['linking', 'utilities'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'withFeatureFlaggedComponent',
			description:
				'Higher-order component that swaps between two implementations based on a feature-gate function. Lets a package ship a new component behind a gate without forking the consuming call sites. The gate function is invoked per render — pass `() => fg("my_gate_name")`.',
			status: 'general-availability',
			signature:
				'<P extends object>(ComponentOld: ComponentType<P>, ComponentNext: ComponentType<P>, featureFlagFn: () => boolean) => (props: P) => JSX.Element',
			parameters: [
				{ name: 'ComponentOld', type: 'ComponentType<P>' },
				{ name: 'ComponentNext', type: 'ComponentType<P>' },
				{
					name: 'featureFlagFn',
					type: '() => boolean',
					description: 'Evaluated each render. Typically `() => fg("gate_name")`.',
				},
			],
			returns: { type: '(props: P) => JSX.Element' },
			usageGuidelines: [
				'`featureFlagFn` is a callback, not a string — it lets the wrapper stay agnostic to which flag system you use (`fg`, Statsig, etc.).',
				'Argument order is `(Old, New, gateFn)` — the old component first matches the migration mental model.',
				'Test both branches with `passGate` / `failGate` from `@atlassian/feature-flags-test-utils/mock-gates`.',
				'Keep both implementations source-compatible — props must be the same shape, or the swap will break call sites.',
			],
			keywords: [
				'utility',
				'withFeatureFlaggedComponent',
				'feature-flag',
				'hoc',
				'linking-common',
			],
			categories: ['linking', 'utilities', 'feature-flags'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'cardAction',
			description:
				'Action creator for the Smart Card Redux store. Builds a `CardAction<T>` from an action type and a `{ url }` params object, plus optional payload, error, metadata status, and an `ignoreStatusCheck` flag that forces the reducer to apply the action regardless of the current/next status. Use the exported `ACTION_*` constants for the `type` argument.',
			status: 'general-availability',
			signature:
				'<T = JsonLd.Response>(type: CardActionType, params: { url: string }, payload?: T, error?: APIError, metadataStatus?: MetadataStatus, ignoreStatusCheck?: boolean) => CardAction<T>',
			parameters: [
				{ name: 'type', type: 'CardActionType' },
				{ name: 'params', type: '{ url: string }', description: 'Card key (URL).' },
				{ name: 'payload', type: 'T', isOptional: true },
				{ name: 'error', type: 'APIError', isOptional: true },
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
			returns: { type: 'CardAction<T>' },
			usageGuidelines: [
				'Always use the `ACTION_*` constants exported alongside `cardAction` instead of typing the string literal — adding a new action type then forces a TypeScript update at every dispatch site.',
				'`ignoreStatusCheck: true` bypasses the reducer guard — use only when you genuinely need to override the FSM, e.g. forcing a reload from outside the store.',
			],
			keywords: ['utility', 'cardAction', 'redux', 'smart-card', 'linking-common'],
			categories: ['linking', 'utilities', 'smart-card', 'state'],
			examples: [],
		},
		{
			kind: 'function',
			name: 'getUrl',
			description:
				'Selector that pulls the `CardState` for a given URL out of the Smart Card Redux store. Returns `{ status: "pending" }` as a default when no entry exists yet, so consumers can render their pending UI without an explicit null check.',
			status: 'general-availability',
			signature: '(store: Store<CardStore>, url: string) => CardState',
			parameters: [
				{ name: 'store', type: 'Store<CardStore>' },
				{ name: 'url', type: 'string', description: 'Card key (URL).' },
			],
			returns: { type: 'CardState' },
			keywords: ['utility', 'getUrl', 'redux', 'smart-card', 'linking-common'],
			categories: ['linking', 'utilities', 'smart-card', 'state'],
			examples: [],
		},
		{
			kind: 'constant',
			name: 'BaseUrls',
			description:
				'Record of resolver environments to Stargate base URLs. Three production aliases (`prd`, `prod`, `production`) all map to the same host; the same goes for `dev` / `development` and `stg` / `staging`. Underlying source of truth for `getBaseUrl`; exported for tests and downstream packages that need to match on the host.',
			status: 'general-availability',
			type: "Record<'dev' | 'development' | 'stg' | 'staging' | 'prd' | 'prod' | 'production', string>",
			usageGuidelines: [
				'Prefer calling `getBaseUrl(envKey)` at runtime instead of indexing this constant directly — the runtime path picks up env-detection overrides for tests and SSR.',
			],
			keywords: ['constant', 'BaseUrls', 'environment', 'linking-common'],
			categories: ['linking', 'constants', 'network'],
			examples: [],
		},
		{
			kind: 'constant',
			name: 'DATASOURCE_DEFAULT_LAYOUT',
			description:
				'Default ADF layout applied to a Datasource node when no explicit layout is provided. Pinned constant so Confluence, Jira, and the editor render identical defaults.',
			status: 'general-availability',
			type: "'wide'",
			value: "'wide'",
			keywords: ['constant', 'DATASOURCE_DEFAULT_LAYOUT', 'datasource', 'linking-common'],
			categories: ['linking', 'constants', 'datasource'],
			examples: [],
		},
		{
			kind: 'constant',
			name: 'CardActions',
			description:
				'Family of action-type string constants exported alongside `cardAction`. Use these instead of string literals when dispatching to or reducing from the Smart Card store. Note that the constant **names** and **string values** diverge in a few places (e.g. `ACTION_ERROR === "errored"`, `ACTION_ERROR_FALLBACK === "fallback"`, `ACTION_UPDATE_METADATA_STATUS === "metadata"`) — always import the constants rather than typing the string.',
			status: 'general-availability',
			type: 'CardActionType (extended)',
			value: [
				"ACTION_PENDING === 'pending'",
				"ACTION_RESOLVING === 'resolving'",
				"ACTION_RESOLVED === 'resolved'",
				"ACTION_RELOADING === 'reloading'",
				"ACTION_ERROR === 'errored'",
				"ACTION_ERROR_FALLBACK === 'fallback'",
				"ACTION_PRELOAD === 'preload'",
				"ACTION_UPDATE_METADATA_STATUS === 'metadata'",
			].join('\n'),
			usageGuidelines: [
				"Always import the constants rather than typing the string — the constant names and the underlying values do not always match (e.g. `ACTION_ERROR === 'errored'`).",
				'`ACTION_RELOADING` is distinct from `ACTION_RESOLVING`: reloading happens when an already-resolved card refreshes; resolving is the first-time fetch.',
				'`ACTION_PRELOAD` is not in `CardActionType` — it is a Smart Card store-internal action that exists alongside the typed action set.',
			],
			keywords: ['constant', 'CardActions', 'redux', 'smart-card', 'linking-common'],
			categories: ['linking', 'constants', 'smart-card', 'state'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'CardAppearance',
			description:
				'Discriminator for how a Smart Link should render: `inline` (chip inside text), `block` (single-line block card), or `embed` (rich preview embed). Used by ADF and by consumer props.',
			status: 'general-availability',
			definition: "type CardAppearance = 'inline' | 'block' | 'embed'",
			keywords: ['type', 'CardAppearance', 'smart-card', 'linking-common'],
			categories: ['linking', 'types', 'smart-card'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'CardType',
			description:
				'Lifecycle status of a Smart Card store entry. Returned by `getStatus` and stored on `CardState.status`. Drives the choice between skeleton, content, error, fallback, unauthorised, forbidden, and not-found renderings.',
			status: 'general-availability',
			definition:
				"type CardType = 'pending' | 'resolving' | 'resolved' | 'errored' | 'fallback' | 'unauthorized' | 'forbidden' | 'not_found'",
			keywords: ['type', 'CardType', 'smart-card', 'linking-common'],
			categories: ['linking', 'types', 'smart-card'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'CardAction',
			description:
				'Redux action shape for the Smart Card store. Extends `AnyAction` with `type: CardActionType`, the card key `url`, an optional response `payload`, and an optional `metadataStatus`. Use the `cardAction` action creator to construct values rather than building this type by hand.',
			status: 'general-availability',
			definition:
				'interface CardAction<T = JsonLd.Response> extends AnyAction { type: CardActionType; url: string; payload?: T; metadataStatus?: MetadataStatus }',
			keywords: ['type', 'CardAction', 'redux', 'smart-card', 'linking-common'],
			categories: ['linking', 'types', 'smart-card', 'state'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'InlineCardAdf',
			description:
				'ADF node shape for inline Smart Links. Sister types `BlockCardAdf`, `EmbedCardAdf`, and `DatasourceAdf` cover the other appearances. Together `InlineCardAdf | BlockCardAdf | EmbedCardAdf` form `CardAdf`, the union accepted by `@atlaskit/editor-common-types` for Smart Link nodes.',
			status: 'general-availability',
			definition: "interface InlineCardAdf { type: 'inlineCard'; attrs: { url: string } }",
			usageGuidelines: [
				'Use `CardAdf` when you need to accept any inline/block/embed Smart Link node and the appearance-specific types when you need to discriminate.',
				'`DatasourceAdf` is structurally a `blockCard` but with a `datasource` attribute — use it explicitly rather than `BlockCardAdf` when working with datasources.',
			],
			keywords: ['type', 'InlineCardAdf', 'adf', 'smart-card', 'linking-common'],
			categories: ['linking', 'types', 'adf'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'Datasource',
			description:
				'Public contract for a Datasource node — id, parameters bag (generic, defaults to `Record<string, unknown>`), and the view configs that describe how the resolved rows should render. Exchanged between the editor, Confluence/Jira renderers, and the resolver.',
			status: 'general-availability',
			definition:
				'interface Datasource<P extends Record<string, unknown> = Record<string, unknown>> { id: string; parameters: P; views: DatasourceAdfView[] }',
			keywords: ['type', 'Datasource', 'datasource', 'linking-common'],
			categories: ['linking', 'types', 'datasource'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'EnvironmentsKeys',
			description:
				'String union of the resolver environments understood by `getBaseUrl` / `getResolverUrl`. Three environments with two-or-three aliases each (`dev` / `development`, `stg` / `staging`, `prd` / `prod` / `production`), plus a special `custom` value that pairs with the `baseUrlOverride` arg for SSR / non-standard hosts.',
			status: 'general-availability',
			definition:
				"type EnvironmentsKeys = 'dev' | 'development' | 'stg' | 'staging' | 'prd' | 'prod' | 'production' | 'custom'",
			keywords: ['type', 'EnvironmentsKeys', 'environment', 'linking-common'],
			categories: ['linking', 'types', 'network'],
			examples: [],
		},
	],
};

export default documentation;

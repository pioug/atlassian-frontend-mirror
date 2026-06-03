/**
 * Structured MCP docs for `@atlaskit/feature-flag-client`.
 *
 * ⚠️ Pilot / not yet final. This file is part of the libraries-content pilot
 * for the "Libraries, hooks, utilities in structured content" RFC. The
 * container schema and per-kind shapes are still in review — expect breaking
 * changes before this is rolled out broadly. Do not depend on the format yet.
 *
 * Library-shaped package: a single default-exported `FeatureFlagClient`
 * (documented as a `kind: 'constant'` utility because it is the runtime
 * export developers interact with), plus a runtime enum and several public
 * types. Demonstrates the utilities-only flavour of `*.docs.tsx` —
 * there are no React components and no hooks here.
 *
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	package: {
		package: '@atlaskit/feature-flag-client',
		packagePath,
		packageJson,
		overview:
			'Runtime client for evaluating feature flags inside Atlassian products. Construct one instance per app with the flag payload from your bootstrap response and an analytics handler, then call typed value getters (`getBooleanValue`, `getVariantValue`, `getJSONValue`) at the call sites where the flag is used. Exposure events fire automatically unless you opt out — opting out lets you batch evaluations and emit a single explicit exposure via `trackFeatureFlag`.',
	},
	utilities: [
		{
			kind: 'constant',
			name: 'FeatureFlagClient',
			description:
				'Default export. The runtime client developers construct and interact with — it evaluates flags from an in-memory flag set, caches per-key flag wrappers, and fires exposure events through the supplied analytics handler. Construct one instance per app bootstrap and pass it through context.',
			status: 'general-availability',
			type: 'class FeatureFlagClient',
			value: [
				'new FeatureFlagClient({ analyticsHandler, flags?, isAutomaticExposuresEnabled?, ignoreTypes? })',
				'  .setFlags(flags: Flags): void',
				'  .setAnalyticsHandler(analyticsHandler?: AnalyticsHandler): void',
				'  .setIsAutomaticExposuresEnabled(isEnabled: boolean): void',
				'  .getBooleanValue(flagKey, { default, exposureData?, shouldTrackExposureEvent? }): boolean',
				'  .getVariantValue(flagKey, { default, oneOf, exposureData?, shouldTrackExposureEvent? }): string',
				'  .getJSONValue(flagKey): object',
				'  .getRawValue(flagKey, { default, exposureData?, shouldTrackExposureEvent? }): FlagValue',
				'  .getFlagEvaluation<T>(flagKey, { default, exposureData?, shouldTrackExposureEvent? }): FlagShape<T>',
				'  .trackFeatureFlag(flagKey, options?: TrackFeatureFlagOptions): void',
				'  .clear(): void',
			].join('\n'),
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
			categories: ['experimentation', 'feature-flags'],
			examples: [],
		},
		{
			kind: 'constant',
			name: 'ExposureTriggerReason',
			description:
				'Enum describing why an exposure event was fired (auto vs. manual vs. consumer opt-in). Surfaced on the exposure event payload so downstream analytics can de-duplicate auto vs. manual fires.',
			status: 'general-availability',
			type: 'enum ExposureTriggerReason',
			value:
				'{ OptIn = "optInExposure", Manual = "manualExposure", Default = "defaultExposure", AutoExposure = "autoExposure", hasCustomAttributes = "hasCustomAttributes" }',
			usageGuidelines: [
				'Use the enum members rather than literal strings when calling `trackFeatureFlag({ triggerReason })` — the literal values change if the backend renames a reason.',
			],
			keywords: ['feature-flag', 'exposure', 'enum', 'ExposureTriggerReason'],
			categories: ['experimentation', 'feature-flags', 'constants'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'FlagValue',
			description: 'Union of the value types a flag can return: `boolean | string | object`.',
			status: 'general-availability',
			definition: 'type FlagValue = boolean | string | object',
			keywords: ['feature-flag', 'type', 'FlagValue'],
			categories: ['experimentation', 'feature-flags', 'types'],
			examples: [],
		},
		{
			kind: 'type',
			name: 'CustomAttributes',
			description:
				'Free-form attribute bag attached to an exposure event. Keys are validated against the reserved-attribute list at runtime — colliding with a reserved key throws.',
			status: 'general-availability',
			definition:
				'type CustomAttributes = { [attributeName: string]: string | number | boolean | object }',
			usageGuidelines: [
				'Keep custom attribute names stable — downstream analytics queries pivot on them. Coordinate any rename with the data-platform team before shipping.',
			],
			keywords: ['feature-flag', 'type', 'CustomAttributes', 'exposure'],
			categories: ['experimentation', 'feature-flags', 'types'],
			examples: [],
		},
	],
};

export default documentation;

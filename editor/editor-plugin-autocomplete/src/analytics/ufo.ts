/**
 * UFO experience tracking helpers for `@atlaskit/editor-plugin-autocomplete`.
 *
 * Pattern follows `packages/linking-platform/smart-card/src/state/analytics/ufoExperiences.ts`
 * (ConcurrentExperience keyed per request/instance) plus a try/catch safety wrap
 * inspired by `packages/editor/collab-provider/src/analytics/ufo.ts` so a UFO
 * runtime error can never break the autocomplete feature.
 *
 * Experience names must be registered in DataPortal's `task` attribute before
 * they can power FE Reliability SLOs:
 * https://hello.atlassian.net/wiki/spaces/AA6/pages/3961393753
 */

import {
	ConcurrentExperience,
	type CustomData,
	ExperiencePerformanceTypes,
	ExperienceTypes,
} from '@atlaskit/ufo';

/**
 * Experience name strings are surfaced downstream by the UFO pipeline as
 * `platform.fe.<type>.<platform.component>.<name>` (e.g.
 * `platform.fe.operation.editor-plugin-autocomplete.slow-lane-fetch`), so
 * names here should be short, dot-free, and must not repeat the component
 * name. This matches the convention used by `@atlaskit/emoji`'s
 * `ufoExperiences` map (e.g. `'emoji-rendered'`).
 */
/**
 * Only experiences with meaningful async work and a real success/failure
 * outcome belong on UFO (which measures latency and success rate for FE
 * Reliability SLOs). Per-keystroke suggestion lifecycle counters (viewed /
 * inserted / dismissed) are tracked via analytics-next instead — they would
 * otherwise emit zero-duration events on every word boundary.
 */
export const EXPERIENCE_NAME = {
	SLOW_LANE_FETCH: 'slow-lane-fetch',
	LOAD_VOCABULARY: 'load-vocabulary',
	LOAD_VECTORS: 'load-vectors',
} as const;

export type AutocompleteExperienceName = (typeof EXPERIENCE_NAME)[keyof typeof EXPERIENCE_NAME];

const isUfoEnabled = (): boolean => !process?.env?.REACT_SSR;

const operationConfig = {
	platform: { component: 'editor-plugin-autocomplete' },
	type: ExperienceTypes.Operation,
	performanceType: ExperiencePerformanceTypes.Custom,
	performanceConfig: {
		histogram: {
			[ExperiencePerformanceTypes.Custom]: {
				duration: '50_100_250_500_1000_2000_4000',
			},
		},
	},
};

const experiences: Record<AutocompleteExperienceName, ConcurrentExperience> = {
	[EXPERIENCE_NAME.SLOW_LANE_FETCH]: new ConcurrentExperience(
		EXPERIENCE_NAME.SLOW_LANE_FETCH,
		operationConfig,
	),
	[EXPERIENCE_NAME.LOAD_VOCABULARY]: new ConcurrentExperience(
		EXPERIENCE_NAME.LOAD_VOCABULARY,
		operationConfig,
	),
	[EXPERIENCE_NAME.LOAD_VECTORS]: new ConcurrentExperience(
		EXPERIENCE_NAME.LOAD_VECTORS,
		operationConfig,
	),
};

export const startExp = (
	name: AutocompleteExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	if (!isUfoEnabled()) {
		return;
	}
	try {
		const instance = experiences[name].getInstance(id);
		instance.start();
		if (metadata) {
			instance.addMetadata(metadata);
		}
	} catch {
		// UFO errors must never break the plugin
	}
};

export const succeedExp = (
	name: AutocompleteExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	if (!isUfoEnabled()) {
		return;
	}
	try {
		experiences[name].getInstance(id).success({ metadata });
	} catch {
		// UFO errors must never break the plugin
	}
};

export const failExp = (
	name: AutocompleteExperienceName,
	id: string,
	metadata?: CustomData,
): void => {
	if (!isUfoEnabled()) {
		return;
	}
	try {
		experiences[name].getInstance(id).failure({ metadata });
	} catch {
		// UFO errors must never break the plugin
	}
};

export const abortExp = (
	name: AutocompleteExperienceName,
	id: string,
	reason?: string,
	metadata?: CustomData,
): void => {
	if (!isUfoEnabled()) {
		return;
	}
	try {
		// `reason` is the dedicated, canonical channel for the abort reason and
		// intentionally takes precedence over a `reason` key in `metadata`. Callers
		// must pass the reason via the param, not inside `metadata` (the `reason`
		// key there is reserved and would be overwritten).
		const merged: CustomData = { ...metadata, ...(reason ? { reason } : {}) };
		const hasMetadata = Object.keys(merged).length > 0;
		experiences[name].getInstance(id).abort(hasMetadata ? { metadata: merged } : undefined);
	} catch {
		// UFO errors must never break the plugin
	}
};

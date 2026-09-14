import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

/** Fixed document thresholds for limited (performance) mode (previously Statsig-driven). */
export const LIMITED_MODE_DEFAULT_NODE_COUNT_THRESHOLD = 5000;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD = 30000;

/**
 * Treatment node-count threshold. Production node-count percentiles across all documents are
 * p90 ≈ 206, p95 ≈ 576, p99 ≈ 2,438 — today's 5,000 sits beyond p99 and fires on only ~0.36% of
 * documents. 2,500 is p99 rounded, i.e. limited mode becomes a guard on the largest ~1% of pages.
 *
 * Deliberately NOT lower: the worst-5%-by-INP cohort has a median document of ~25 nodes, so its
 * slowness is device/extension/collab-bound and structurally invisible. No node-count value catches
 * it without enabling limited mode for nearly everyone (300 nodes ⇒ 8% of all sessions for 34%
 * recall). Chasing that cohort needs a runtime input-latency trigger, not a bigger document guard.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const LIMITED_MODE_TWEAKED_NODE_COUNT_THRESHOLD = 2438;

/**
 * Treatment `nodeSize` threshold — a backstop for pathologically huge documents, not a routine
 * trigger. Input latency really does degrade at extreme document sizes: the 100k+ `nodeSize` bucket
 * sits at p90 113.5ms / p99 899ms, against p90 25.6ms in the 6k–11k bucket. But that curve is smooth
 * and only becomes severe far past the body of the distribution (production `nodeSize` p99 is
 * ~91.8k), so this is set well beyond p99 rather than at the control's 30,000 — which fires around
 * p95 and so degrades a large population of plain long-text pages that type perfectly well.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const LIMITED_MODE_TWEAKED_DOC_SIZE_THRESHOLD = 750000;

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export type LimitedModeThresholds = {
	docSizeThreshold: number;
	nodeCountThreshold: number;
};

/**
 * The document thresholds currently in force. This is the only place the cohort is resolved — the
 * limited-mode decision itself is identical either way, only these two numbers change.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const getLimitedModeThresholds = (): LimitedModeThresholds =>
	isExperimentEnabled('platform_editor_limited_threshold_tweaks')
		? {
				docSizeThreshold: LIMITED_MODE_TWEAKED_DOC_SIZE_THRESHOLD,
				nodeCountThreshold: LIMITED_MODE_TWEAKED_NODE_COUNT_THRESHOLD,
			}
		: {
				docSizeThreshold: LIMITED_MODE_DEFAULT_DOC_SIZE_THRESHOLD,
				nodeCountThreshold: LIMITED_MODE_DEFAULT_NODE_COUNT_THRESHOLD,
			};

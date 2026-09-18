import {
	isPerformanceAPIAvailable,
	isPerformanceObserverLongTaskAvailable,
} from '@atlaskit/editor-common/is-performance-api-available';

import type { CreateLatchDetectorOptions, LatchDetector } from './latch-detector-types';
import type { LatchPolicy } from './latch-policy';

/**
 * Wires browser performance signals into the supplied {@link LatchPolicy}.
 *
 * Holds no configuration and makes no decisions: it measures, and forwards. Everything tunable lives
 * on the policy, including the clock it reads.
 *
 * The measurement mirrors `editor-plugin-base/src/pm-plugins/frozen-editor.ts`, which already runs an
 * identical `longtask` observer and per-keystroke rAF measurement for every session to feed
 * `ACTION.SLOW_INPUT` / `ACTION.BROWSER_FREEZE`. It is duplicated rather than shared so that this
 * experiment stays self-contained inside the limited-mode plugin — no new cross-plugin dependency,
 * and deleting it is a single-directory revert if the experiment does not ship. The marginal cost is
 * one `performance.now()` and one `requestAnimationFrame` per keystroke.
 */
export const createLatchDetector = ({
	onLatchCriteriaMet,
	policy,
}: CreateLatchDetectorOptions): LatchDetector => {
	// One clock for the whole subsystem, so measured durations and the policy's windows agree.
	const now = policy.now;

	let observer: PerformanceObserver | undefined;
	let destroyed = false;

	const handleEvaluation = (evaluation: ReturnType<LatchPolicy['recordInputLatency']>) => {
		if (evaluation !== 'latched') {
			return;
		}

		// One-way latch: the policy will never evaluate again, so stop paying for the observers.
		teardownObservers();

		const details = policy.getLatchDetails();
		if (details) {
			onLatchCriteriaMet(details);
		}
	};

	function teardownObservers() {
		observer?.disconnect();
		observer = undefined;
	}

	if (isPerformanceObserverLongTaskAvailable()) {
		try {
			observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					if (policy.isLatched()) {
						return;
					}

					handleEvaluation(policy.recordLongTask(entry.duration));
				}
			});

			observer.observe({ entryTypes: ['longtask'] });
		} catch {
			// `longtask` is unsupported in some browsers even when PerformanceObserver exists. The
			// latency criterion alone is still a valid trigger, so carry on without freeze detection.
			observer = undefined;
		}
	}

	return {
		noteDocumentChange: ({ nodeSizeDelta, isDocumentReplaced }) => {
			if (destroyed || policy.isLatched()) {
				return;
			}

			if (isDocumentReplaced || policy.isBulkChange(nodeSizeDelta)) {
				policy.suppress();
			}
		},
		measureInput: () => {
			if (destroyed || policy.isLatched() || !isPerformanceAPIAvailable()) {
				return;
			}

			const start = now();

			// Runs after every handleTextInput and all resulting plugin work, but before paint — the
			// same measurement point frozen-editor uses, so the numbers are comparable to existing
			// SLOW_INPUT telemetry.
			requestAnimationFrame(() => {
				if (destroyed || policy.isLatched()) {
					return;
				}

				handleEvaluation(policy.recordInputLatency(now() - start));
			});
		},
		destroy: () => {
			destroyed = true;
			teardownObservers();
		},
	};
};

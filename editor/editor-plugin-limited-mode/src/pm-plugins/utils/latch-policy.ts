import { median } from '@atlaskit/editor-common/median';
import { shouldEnableLimitedModeForDocument } from '@atlaskit/editor-common/should-enable-limited-mode';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type {
	LatchDetails,
	LatchEvaluation,
	LatchPolicyConfig,
	LatchPolicyOptions,
	LatchReason,
} from './latch-policy-types';

/**
 * The shipped policy.
 *
 * These values add up to: nothing counts for the first 10s; then a window qualifies on either 6 of
 * 12 keystrokes slower than 100ms with that window's median also over 100ms, or 3 long tasks over
 * 600ms within 30s corroborated by a slow keystroke in that same 30s. Two qualifying windows at
 * least 30s apart latch limited mode.
 *
 * `freezeTaskMs` matches `DEFAULT_FREEZE_THRESHOLD` in
 * `editor-plugin-base/src/pm-plugins/frozen-editor.ts`, which backs the existing
 * `ACTION.BROWSER_FREEZE` telemetry, so production dashboards can be used to calibrate it.
 * `slowInputMs` is deliberately tighter than that file's `DEFAULT_SLOW_THRESHOLD` of 300 — this
 * needs to notice a degraded experience, not just an unusable one.
 *
 * `requiredConfirmations` and `confirmationGapMs` are the values that matter most — see the comment
 * on the former.
 */
export const DEFAULT_LATCH_POLICY_CONFIG: LatchPolicyConfig = {
	warmUpMs: 10_000,
	slowInputMs: 100,
	latencyWindowSize: 12,
	latencySlowSamplesRequired: 6,
	freezeTaskMs: 600,
	freezeTasksRequired: 3,
	freezeWindowMs: 30_000,
	requiredConfirmations: 2,
	confirmationGapMs: 30_000,
	bulkChangeNodeSize: 100,
	bulkChangeSuppressionMs: 2_000,
	docSizeThreshold: 750_000,
	nodeCountThreshold: 5_000,
};

/**
 * Decides whether limited mode should be on.
 *
 * The single authority for that question, covering both reasons:
 *
 * - **The document** — too large, too many nodes, or containing a legacy content macro. Evaluated on
 *   load and on document replacement, so it can turn back off (a `replaceDocument` onto a smaller
 *   page) without costing a full-document walk per transaction.
 * - **The device** — sustained slow keystrokes or repeated long tasks. **One-way**: once the runtime
 *   bar is met the policy stops evaluating, so the editor can never oscillate between modes.
 *
 * `isBreached()` is the combined verdict. Everything tunable is in `config`, so the whole high bar is
 * unit-testable without needing to make a real browser slow, and a caller can substitute a
 * differently configured policy. `latch-detector.ts` owns the browser plumbing that feeds the runtime
 * criteria, and takes a policy instance rather than constructing one.
 */
export class LatchPolicy {
	/** Public so the detector can read the tunables it needs rather than duplicating them. */
	public readonly config: LatchPolicyConfig;
	/** Public so the detector shares one clock with the policy. */
	public readonly now: () => number;

	private readonly startedAt: number;

	private latencySamples: number[] = [];
	private freezeTimes: number[] = [];
	private lastSlowInputAt: number | undefined;
	private firstQualifiedAt: number | undefined;
	private lastQualifiedAt: number | undefined;
	private qualifiedWindows = 0;
	private suppressedUntil = 0;
	private latched = false;
	private documentBreached = false;
	private firstWindowReason: LatchReason | undefined;
	private latchDetails: LatchDetails | undefined;
	/** Cumulative for the session and never cleared, unlike the evidence buffers. */
	private totalInputSamples = 0;
	private totalSlowInputs = 0;
	private totalFreezes = 0;

	constructor({ now, config }: LatchPolicyOptions) {
		this.now = now;
		this.config = { ...DEFAULT_LATCH_POLICY_CONFIG, ...config };
		this.startedAt = now();
	}

	/**
	 * Whether limited mode should be on, for either reason. This is the verdict consumers act on.
	 */
	public isBreached(): boolean {
		return this.documentBreached || this.latched;
	}

	/**
	 * What the latch was based on, or `undefined` while un-latched. Intended for telemetry — nothing in
	 * the decision reads it back.
	 */
	public getLatchDetails(): LatchDetails | undefined {
		return this.latchDetails;
	}

	/** Whether the runtime (device) criteria have latched. One-way, and never cleared. */
	public isLatched(): boolean {
		return this.latched;
	}

	/**
	 * Latch the runtime reason directly, without accumulating evidence for it.
	 *
	 * The policy latches itself when its own criteria are met, so this exists for callers that have
	 * already decided: the plugin replaying the detector's latch transaction, and dev tooling forcing
	 * the state by hand. Idempotent, and one-way like every other route to `latched`.
	 */
	public latch(): void {
		if (this.latched) {
			return;
		}

		this.latched = true;
		this.latchDetails = this.buildDetails('forced', undefined);
	}

	/** Whether the document currently breaches the thresholds. Can go back to false. */
	public isDocumentBreached(): boolean {
		return this.documentBreached;
	}

	/**
	 * Evaluate the document reason against the size / node-count / legacy-content-macro thresholds.
	 *
	 * Walks the whole document, so the caller decides when it is worth paying for: `pm-plugins/main.ts`
	 * calls this on load and on `replaceDocument` (e.g. live-to-live page navigation) only, never per
	 * transaction. Editing therefore cannot turn the document reason on — a page that grows past the
	 * thresholds mid-session is only re-judged the next time it loads — but replacement can still turn
	 * it back off.
	 */
	public evaluateDocument(doc: PMNode): void {
		this.documentBreached = shouldEnableLimitedModeForDocument(doc, {
			docSizeThreshold: this.config.docSizeThreshold,
			nodeCountThreshold: this.config.nodeCountThreshold,
		});
	}

	/**
	 * Whether a `doc.nodeSize` delta is large enough to be bulk work rather than typing. A keystroke
	 * moves this by 1; a paste, a bulk replace or a document load moves it far more.
	 */
	public isBulkChange(nodeSizeDelta: number): boolean {
		return Math.abs(nodeSizeDelta) >= this.config.bulkChangeNodeSize;
	}

	/**
	 * Discard signals for a window. Called for bulk work, which is expensive but transient and
	 * self-limiting, so its cost must not be attributed to the device struggling.
	 */
	public suppress(): void {
		if (this.latched) {
			return;
		}

		this.suppressedUntil = this.now() + this.config.bulkChangeSuppressionMs;
	}

	/**
	 * Feed one keystroke's input latency (dispatch through to the next animation frame).
	 */
	public recordInputLatency(durationMs: number): LatchEvaluation {
		if (!this.canRecord()) {
			return 'ignored';
		}

		const { slowInputMs, latencyWindowSize, latencySlowSamplesRequired } = this.config;

		this.totalInputSamples += 1;

		if (durationMs > slowInputMs) {
			this.totalSlowInputs += 1;
			// Remembered even once the window rolls over, so the freeze criterion below can check that
			// the jank actually coincided with editing.
			this.lastSlowInputAt = this.now();
		}

		this.latencySamples.push(durationMs);
		if (this.latencySamples.length > latencyWindowSize) {
			this.latencySamples.shift();
		}

		if (this.latencySamples.length < latencyWindowSize) {
			return 'recorded';
		}

		const slowSamples = this.latencySamples.filter((sample) => sample > slowInputMs).length;
		if (slowSamples < latencySlowSamplesRequired) {
			return 'recorded';
		}

		// Median rather than mean: a mean is dragged over the threshold by one or two outliers, which
		// is exactly the transient jank this policy is meant to ignore.
		const windowMedian = median(this.latencySamples);
		if (windowMedian <= slowInputMs) {
			return 'recorded';
		}

		return this.qualify('inputLatency', windowMedian);
	}

	/**
	 * Feed one `longtask` PerformanceObserver entry.
	 */
	public recordLongTask(durationMs: number): LatchEvaluation {
		if (!this.canRecord()) {
			return 'ignored';
		}

		const { freezeTaskMs, freezeWindowMs, freezeTasksRequired } = this.config;

		if (durationMs <= freezeTaskMs) {
			return 'recorded';
		}

		const now = this.now();

		this.totalFreezes += 1;
		this.freezeTimes.push(now);
		this.freezeTimes = this.freezeTimes.filter((time) => now - time <= freezeWindowMs);

		if (this.freezeTimes.length < freezeTasksRequired) {
			return 'recorded';
		}

		// Corroboration. `longtask` is process-wide, so without this a busy background tab or an
		// unrelated app could latch an editor the user is typing in perfectly happily.
		if (this.lastSlowInputAt === undefined || now - this.lastSlowInputAt > freezeWindowMs) {
			return 'recorded';
		}

		return this.qualify('freeze');
	}

	private canRecord(): boolean {
		if (this.latched) {
			return false;
		}

		const now = this.now();

		if (now - this.startedAt < this.config.warmUpMs) {
			return false;
		}

		return now >= this.suppressedUntil;
	}

	/** Snapshot of what the latch was based on. Called before the evidence buffers are cleared. */
	private buildDetails(reason: LatchReason, latencyMedianMs: number | undefined): LatchDetails {
		const now = this.now();

		return {
			reason,
			firstWindowReason: this.firstWindowReason ?? reason,
			requiredConfirmations: this.config.requiredConfirmations,
			documentAlreadyBreached: this.documentBreached,
			msFromFirstWindow:
				this.firstQualifiedAt === undefined ? undefined : Math.round(now - this.firstQualifiedAt),
			latencyMedianMs: latencyMedianMs === undefined ? undefined : Math.round(latencyMedianMs),
			timeToLatchMs: Math.round(now - this.startedAt),
			totalInputSamples: this.totalInputSamples,
			totalSlowInputs: this.totalSlowInputs,
			totalFreezes: this.totalFreezes,
		};
	}

	private qualify(reason: LatchReason, latencyMedianMs?: number): LatchEvaluation {
		const now = this.now();

		// Each qualifying window must be independent evidence, so the buffers are cleared rather than
		// left to re-trigger off the same samples on the very next keystroke.
		this.latencySamples = [];
		this.freezeTimes = [];

		// Too soon after the last counted window to be independent of it, so it earns no credit. The
		// buffers above are still cleared, which is what makes the run rebuild from scratch.
		if (
			this.lastQualifiedAt !== undefined &&
			now - this.lastQualifiedAt < this.config.confirmationGapMs
		) {
			return 'qualified';
		}

		this.qualifiedWindows += 1;
		this.lastQualifiedAt = now;

		if (this.firstQualifiedAt === undefined) {
			this.firstQualifiedAt = now;
			this.firstWindowReason = reason;
		}

		if (this.qualifiedWindows < this.config.requiredConfirmations) {
			return 'qualified';
		}

		this.latched = true;
		this.latchDetails = this.buildDetails(reason, latencyMedianMs);

		return 'latched';
	}
}

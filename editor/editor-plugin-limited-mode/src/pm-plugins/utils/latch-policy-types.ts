/**
 * Every tunable the latch decision depends on.
 *
 * All of it lives here rather than being spread across the detector and the plugin: the numbers *are*
 * the policy, so a different policy is a different set of these values, and having them in one place
 * is what makes the trigger reviewable and tunable as a unit.
 *
 * Shape of the decision, so the fields below read in context. Two independent criteria can each
 * close a "qualifying window": sustained slow keystrokes (`slowInputMs`, `latency*`) or repeated
 * long tasks (`freeze*`). Latching needs `requiredConfirmations` such windows, each separated from
 * the last by `confirmationGapMs`. `warmUpMs` and `bulkChange*` decide when signals are discarded
 * rather than counted.
 */
export type LatchPolicyConfig = {
	/**
	 * Smallest absolute `doc.nodeSize` delta, compared inclusively, for a transaction to count
	 * as bulk work rather than typing — a keystroke moves it by 1, a paste or document load far
	 * more. Operations that are expensive but barely change size, such as a table resize or a
	 * drag-and-drop move (delete + insert nets to roughly 0), are not caught by this.
	 */
	bulkChangeNodeSize: number;
	/**
	 * How long every signal is discarded once bulk work is reported, measured forward from that
	 * moment. Each new report pushes the deadline out again, so back-to-back bulk changes hold the
	 * window open rather than each getting their own.
	 */
	bulkChangeSuppressionMs: number;
	/**
	 * Minimum gap between one qualifying window and the next for the later one to count, compared
	 * inclusively. Measured from the previous *counted* window, so raising `requiredConfirmations`
	 * raises the total time to latch with it. A window arriving sooner earns no credit yet still
	 * clears the evidence buffers, so the run rebuilds from scratch.
	 */
	confirmationGapMs: number;
	/**
	 * `doc.nodeSize` above which the document alone puts the editor into limited mode, compared
	 * strictly. A backstop for pathologically large documents rather than a routine trigger — see
	 * `limited-mode-document-thresholds.ts` for the production percentiles behind the shipped value.
	 */
	docSizeThreshold: number;
	/** Duration a single long task must exceed to be counted as a freeze. */
	freezeTaskMs: number;
	/**
	 * How many freezes must sit inside `freezeWindowMs` for the freeze criterion to qualify. They
	 * only count alongside a recent slow keystroke — see `freezeWindowMs`.
	 */
	freezeTasksRequired: number;
	/**
	 * Does two jobs. It is the sliding window freezes are retained in, older entries being pruned by
	 * timestamp on each new freeze; and it is the horizon within which a slow keystroke must have
	 * occurred for those freezes to count at all. `longtask` is process-wide, so without that
	 * corroboration a busy background tab could latch an editor that is typing perfectly happily.
	 */
	freezeWindowMs: number;
	/**
	 * How many samples in a full window must individually exceed `slowInputMs`. This is a floor
	 * on how widespread the slowness is, while the median check described on `slowInputMs` is what
	 * stops a couple of outliers qualifying on their own. Both conditions have to hold.
	 */
	latencySlowSamplesRequired: number;
	/**
	 * How many keystroke samples the latency criterion is evaluated over. The buffer slides one
	 * sample at a time, dropping the oldest, and the criterion is only checked once it is full.
	 */
	latencyWindowSize: number;
	/**
	 * Node count above which the document alone puts the editor into limited mode, compared strictly.
	 * Counted by a full `doc.descendants` walk, which is why `evaluateDocument` is only ever called on
	 * load and on document replacement rather than per transaction.
	 */
	nodeCountThreshold: number;
	/**
	 * How many qualifying windows must accumulate before limited mode latches.
	 *
	 * The single most important tunable, because the latch is one-way: a false positive degrades the
	 * editor for the rest of the session. Requiring the evidence to reappear across a
	 * `confirmationGapMs` gap is what distinguishes "this device is struggling" from "something
	 * happened", and stops a large undo, a misbehaving extension or a video call starting from
	 * latching on their own. `1` latches on the first window and skips that protection entirely.
	 */
	requiredConfirmations: number;
	/**
	 * The bar for "slow", applied three ways: per sample when counting towards
	 * `latencySlowSamplesRequired`; as the value a full window's *median* must exceed; and to
	 * stamp the most recent slow keystroke, which is what corroborates the freeze criterion.
	 * Every comparison is strict, and the median is used rather than a mean precisely because a
	 * mean is dragged over the bar by one or two outliers.
	 */
	slowInputMs: number;
	/**
	 * Grace period, measured from the policy being constructed, during which every signal is
	 * dropped. Editor load is reliably janky and self-resolving, so sampling through it would
	 * latch nearly every session.
	 */
	warmUpMs: number;
};

/** Which criterion closed a qualifying window. */
export type LatchReason =
	/** Sustained slow keystrokes. */
	| 'inputLatency'
	/** Repeated long tasks, corroborated by a slow keystroke. */
	| 'freeze'
	/** Latched directly by a caller rather than by accumulated evidence — see `latch()`. */
	| 'forced';

/**
 * What the latch was based on, captured at the moment it happened.
 *
 * Evidence buffers are cleared on every qualifying window, so the per-window numbers here are
 * snapshotted before that happens; the `total*` counters are cumulative for the session and are never
 * cleared, which is what makes them comparable across sessions.
 */
export type LatchDetails = {
	/** Whether the document was already breaching when the runtime criteria latched. */
	documentAlreadyBreached: boolean;
	/** Which criterion closed the *first* qualifying window. */
	firstWindowReason: LatchReason;
	/** Median of the closing latency window, when `reason` is `inputLatency`. */
	latencyMedianMs: number | undefined;
	/**
	 * Elapsed time from the first qualifying window to the latch, so it spans every gap that was
	 * waited out. `0` when a single window latched, and undefined for a forced latch, which has no
	 * qualifying window behind it.
	 */
	msFromFirstWindow: number | undefined;
	/** Which criterion closed the window that latched. */
	reason: LatchReason;
	/** The `requiredConfirmations` in force for this session, so the bar that was met is known. */
	requiredConfirmations: number;
	/** Milliseconds from the policy being constructed to the latch. */
	timeToLatchMs: number;
	totalFreezes: number;
	totalInputSamples: number;
	totalSlowInputs: number;
};

/** Outcome of feeding a signal to the policy. Returned so callers can act on each stage. */
export type LatchEvaluation =
	/** Discarded: already latched, still warming up, or suppressed. */
	| 'ignored'
	/** Counted as evidence, but the bar is not met. */
	| 'recorded'
	/** A qualifying window closed; still waiting for confirmation. */
	| 'qualified'
	/** The full bar is met. The caller should latch. */
	| 'latched';

export type LatchPolicyOptions = {
	/** Overrides for individual tunables; anything omitted falls back to the shipped default. */
	config?: Partial<LatchPolicyConfig>;
	/** Injectable clock — keeps the policy deterministic under test. */
	now: () => number;
};

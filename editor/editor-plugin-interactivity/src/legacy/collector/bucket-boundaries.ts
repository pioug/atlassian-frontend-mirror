/**
 * Bucket boundaries for the interaction latency buckets, version 1.
 *
 * Two ranges:
 * - 16 ms to 200 ms — a boundary every 8 ms: 16, 24, 32, … 200. Event Timing rounds
 *   durations to 8 ms, so nothing finer is measurable.
 * - above 200 ms — each boundary ~15% above the previous one, five of them per doubling:
 *   222, 256, 294, 337, 388, 445, 512, … A 40 ms difference matters at 100 ms and is
 *   noise at 4 seconds, so buckets grow with the latency instead of staying 8 ms wide.
 *
 * 500 ms — the Google INP "poor" threshold — falls inside the 445…512 bucket, so that one
 * bucket is split at 500 to count the threshold instead of interpolating it. 200 ms, the
 * "good" threshold, is already a boundary.
 *
 * Bump SCHEMA_VERSION whenever any boundary moves; queries group by it.
 */
export const SCHEMA_VERSION = 1;

/**
 * Event Timing reporting threshold. Faster interactions are never delivered to the
 * observer, so they reach no bucket at all — `performance.interactionCount` is what counts
 * them, as `totalCount - observedCount`. This bucket holds the interactions reported at
 * exactly the threshold.
 */
export const REPORTING_THRESHOLD_MS = 16;

/**
 * Exceptions to the grid: latencies that must be a boundary of their own so that they are
 * counted exactly rather than read off a bucket that spans them. Each one splits the bucket it
 * falls inside. 500 ms is the Google INP "poor" threshold; the "good" one, 200 ms, needs no
 * exception because the evenly spaced range already ends there.
 *
 * Every entry has to sit above that range, and adding one changes the reported keys, so bump
 * SCHEMA_VERSION with it.
 */
const EXACT_THRESHOLDS_MS = [500];
const EVENLY_SPACED_MAX_MS = 200;
/**
 * Keep this a multiple of 8 (8, 16, 24, …). Event Timing reports durations in 8 ms steps, so a
 * step that is not a multiple of 8 leaves buckets no interaction can ever land in.
 */
const EVENLY_SPACED_STEP_MS = 8;
const BOUNDARIES_PER_DOUBLING = 5;

/**
 * The first boundary at or above `latencyMs`, for the range above 200 ms.
 *
 * Five boundaries per doubling is the same as saying the nth boundary sits at `2^(n/5)` ms —
 * boundary 40 at 256 ms, 45 at 512 ms, 50 at 1024 ms. So this turns the latency into a
 * boundary number, rounds that up, and turns it back into milliseconds.
 *
 * Boundaries are floored to whole milliseconds, which keeps each one at or below the exact
 * value it stands for. That is what makes `bucketKeyForMs(boundary) === boundary` hold.
 */
function firstBoundaryAtOrAbove(latencyMs: number): number {
	// `Math.log2(latencyMs) * 5` is the boundary number: log2 answers how many doublings of
	// 1 ms reach this latency, and five boundaries cover each doubling.
	//
	// A latency sitting on a boundary makes that a whole number, which `Math.ceil` has to
	// keep. ECMA-262 only requires `Math.log2` to be approximate, so 9.0000000000000002 for
	// `log2(512)` would round up to boundary 46 and report 512 ms as 588 ms. EPSILON is
	// larger than such imprecision and far smaller than the gap between two boundaries.
	const EPSILON = 1e-9;
	const boundaryNumber = Math.ceil(BOUNDARIES_PER_DOUBLING * Math.log2(latencyMs) - EPSILON);

	// One `Math.pow` over the whole exponent, so the result is rounded once. Multiplying the
	// ratio between neighbouring boundaries (2^(1/5) ≈ 1.1487) by itself instead accumulates
	// the rounding of every step, reaching 512.0000000000018 by boundary 45.
	return Math.floor(Math.pow(2, boundaryNumber / BOUNDARIES_PER_DOUBLING));
}

/** The bucket each exact threshold splits — 500 ms splits the one ending at 512 ms. */
const EXACT_THRESHOLD_BUCKETS = EXACT_THRESHOLDS_MS.map((thresholdMs) => ({
	thresholdMs,
	bucketMs: firstBoundaryAtOrAbove(thresholdMs),
}));

/**
 * The bucket a latency belongs to, identified by the bucket's upper boundary in whole
 * milliseconds — which is also its key in the reported buckets.
 *
 * Every latency gets a bucket, however slow: the boundaries continue upwards, so there is no
 * overflow bucket. Expects the whole-millisecond durations Event Timing reports; boundaries
 * are floored, so a fractional latency can land in a bucket whose key reads up to a
 * millisecond below it. Non-finite latencies never reach here — `InteractionTracker` drops
 * them as it reads the entry.
 */
export function bucketKeyForMs(latencyMs: number): number {
	if (latencyMs <= REPORTING_THRESHOLD_MS) {
		return REPORTING_THRESHOLD_MS;
	}

	if (latencyMs <= EVENLY_SPACED_MAX_MS) {
		// How many 8 ms steps above the threshold the latency is, rounded up: 17 ms is 0.125
		// steps up and lands on the boundary one step up, 24 ms. Rounding up is what keeps the
		// set of keys fixed when a latency is not a multiple of 8 ms.
		//
		// No EPSILON here, unlike the branch below: subtracting whole numbers gives a whole
		// number, and dividing by a power of two shifts a binary float's exponent without
		// touching its digits, so a latency on a boundary cannot come out just above a whole
		// number of steps.
		const steps = Math.ceil((latencyMs - REPORTING_THRESHOLD_MS) / EVENLY_SPACED_STEP_MS);
		return REPORTING_THRESHOLD_MS + steps * EVENLY_SPACED_STEP_MS;
	}

	const boundary = firstBoundaryAtOrAbove(latencyMs);

	// A latency in the lower part of a split bucket is reported as the threshold itself, so the
	// threshold is counted exactly.
	for (const { thresholdMs, bucketMs } of EXACT_THRESHOLD_BUCKETS) {
		if (boundary === bucketMs && latencyMs <= thresholdMs) {
			return thresholdMs;
		}
	}

	return boundary;
}

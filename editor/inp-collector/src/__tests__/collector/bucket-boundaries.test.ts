import {
	bucketKeyForMs,
	REPORTING_THRESHOLD_MS,
	SCHEMA_VERSION,
	// @ts-ignore - this is not a valid package entry point and cannot be resolved when using a modern Typescript 'moduleResolution' setting
} from '../../collector/bucket-boundaries';

/**
 * The boundaries of schema 1, written out as data. Any change to the bucket layout has to
 * change this list, which is the signal to bump `SCHEMA_VERSION`.
 */
const EXPECTED_BOUNDARIES = [
	// every 8ms from the reporting threshold to the INP "good" threshold
	16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 184,
	192, 200,
	// five per doubling above it, with 500 split out of the 445…512 bucket
	222, 256, 294, 337, 388, 445, 500, 512, 588, 675, 776, 891, 1024, 1176, 1351, 1552, 1782, 2048,
];

/** Enumerates the boundaries the histogram actually uses, through its public API only. */
const observedBoundaries = (maxMs: number): number[] => {
	const boundaries = new Set<number>();
	for (let latencyMs = 1; latencyMs <= maxMs; latencyMs++) {
		const boundary = bucketKeyForMs(latencyMs);
		if (boundary <= maxMs) {
			boundaries.add(boundary);
		}
	}
	return Array.from(boundaries).sort((a, b) => a - b);
};

describe('bucket boundaries (schema 1)', () => {
	it('lays out the buckets the schema promises', () => {
		expect(SCHEMA_VERSION).toBe(1);
		expect(REPORTING_THRESHOLD_MS).toBe(16);
		expect(observedBoundaries(2048)).toEqual(EXPECTED_BOUNDARIES);
	});

	it('collapses everything below the reporting threshold into one bucket', () => {
		expect(bucketKeyForMs(0)).toBe(16);
		expect(bucketKeyForMs(8)).toBe(16);
		expect(bucketKeyForMs(16)).toBe(16);
	});

	it('is evenly spaced with an 8ms step up to 200ms', () => {
		expect(bucketKeyForMs(24)).toBe(24);
		expect(bucketKeyForMs(192)).toBe(192);
		expect(bucketKeyForMs(200)).toBe(200);
	});

	it('normalises a latency that is not a multiple of the 8ms step', () => {
		// Event Timing rounds durations to 8ms, but the key set has to stay fixed even if
		// a latency ever arrives off the grid — otherwise cross-session sums break.
		expect(bucketKeyForMs(17)).toBe(24);
		expect(bucketKeyForMs(23)).toBe(24);
		expect(bucketKeyForMs(25)).toBe(32);
		expect(bucketKeyForMs(193)).toBe(200);
	});

	it('makes the INP good and poor thresholds exact boundaries', () => {
		expect(bucketKeyForMs(200)).toBe(200);
		expect(bucketKeyForMs(500)).toBe(500);
		expect(bucketKeyForMs(499)).toBe(500);
		expect(bucketKeyForMs(446)).toBe(500);
	});

	it('splits the bucket that holds 500ms instead of shifting the boundaries', () => {
		// 445 and 512 stay where they are; 500 is inserted between them.
		expect(bucketKeyForMs(445)).toBe(445);
		expect(bucketKeyForMs(501)).toBe(512);
		expect(bucketKeyForMs(512)).toBe(512);
		expect(bucketKeyForMs(513)).toBe(588);
	});

	it('doubles the bucket size every five boundaries above 200ms', () => {
		const above200 = EXPECTED_BOUNDARIES.filter((boundary) => boundary > 200 && boundary !== 500);

		// Boundaries are floored to whole milliseconds, so doubling is exact only where the
		// boundary itself is (the powers of two) and off by at most 1ms everywhere else:
		// 337 is followed by 675 rather than 674.
		const notDoubling = above200
			.slice(0, -5)
			.filter((boundary, index) => Math.abs(above200[index + 5] - boundary * 2) > 1);
		expect(notDoubling).toEqual([]);

		// Which also means every power of two is an exact boundary.
		expect(bucketKeyForMs(256)).toBe(256);
		expect(bucketKeyForMs(1024)).toBe(1024);
		expect(bucketKeyForMs(2048)).toBe(2048);
		expect(bucketKeyForMs(1025)).toBe(1176);
	});

	it('puts a latency that sits exactly on a boundary in that boundary bucket', () => {
		const boundaries = observedBoundaries(16_384);
		const reportedElsewhere = boundaries.filter(
			(boundary) => bucketKeyForMs(boundary) !== boundary,
		);

		expect(reportedElsewhere).toEqual([]);
	});

	it('never reports a bucket below the latency it holds', () => {
		const latencies = Array.from({ length: 4000 }, (_, index) => (index + 1) * 8);
		const understated = latencies.filter((latencyMs) => bucketKeyForMs(latencyMs) < latencyMs);

		expect(understated).toEqual([]);
	});

	it('has no upper bound', () => {
		expect(bucketKeyForMs(60_000)).toBe(65_536);
		expect(bucketKeyForMs(600_000)).toBeGreaterThan(bucketKeyForMs(300_000));
	});
});

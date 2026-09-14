/**
 * Snapshots are taken 10 s, 30 s and 60 s after the session starts, then every 60 s. The
 * first three come close together so that short sessions, which are the common case, are
 * still reported.
 */
const INITIAL_OFFSETS_MS = [10_000, 30_000, 60_000];
const INTERVAL_MS = 60_000;

/**
 * Fires `onTick` on the snapshot cadence. Timings are offsets from `start()`, so a
 * restart (a new session in the same editor) restarts the cadence too.
 */
export class SnapshotScheduler {
	private timeoutId: number | undefined;
	private tickIndex = 0;

	constructor(private readonly onTick: () => void) {}

	start(): void {
		this.tickIndex = 0;
		this.scheduleNext();
	}

	restart(): void {
		this.stop();
		this.start();
	}

	stop(): void {
		if (this.timeoutId !== undefined) {
			window.clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
	}

	private scheduleNext(): void {
		this.timeoutId = window.setTimeout(() => {
			this.tickIndex += 1;
			this.onTick();
			this.scheduleNext();
		}, this.delayForNextTick());
	}

	private delayForNextTick(): number {
		const offset = INITIAL_OFFSETS_MS[this.tickIndex];
		if (offset === undefined) {
			return INTERVAL_MS;
		}

		const previousOffset = this.tickIndex === 0 ? 0 : INITIAL_OFFSETS_MS[this.tickIndex - 1];
		return offset - previousOffset;
	}
}

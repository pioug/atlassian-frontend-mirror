/**
 * The clock a read stamps its exposure with. Not part of the public API.
 *
 * This is the one host capability the client needs before the delivery subsystem has loaded, so it
 * is deliberately separate from {@link ExposureEnvironment}: an exposure buffered on the critical
 * path must carry the time its read observed, while everything else the subsystem touches — storage,
 * `fetch`, timers, page lifecycle — is constructed with the subsystem itself.
 */

export interface ExposureClock {
	/** Epoch milliseconds, as `Date.now()` reports them. */
	now(): number;
}

export function defaultExposureClock(): ExposureClock {
	return { now: () => Date.now() };
}

let clockFactory: () => ExposureClock = defaultExposureClock;

/** The clock an enabled client stamps its exposures with. */
export function createExposureClock(): ExposureClock {
	return clockFactory();
}

/**
 * Replace the clock enabled clients are constructed with, or restore the default when called without
 * a factory. A fake should share its time source with the fake {@link ExposureEnvironment}, so a
 * read's timestamp and the logger's deduplication windows agree. For tests only; it is not exported
 * from the package entry point.
 */
export function setExposureClockFactory(factory?: () => ExposureClock): void {
	clockFactory = factory ?? defaultExposureClock;
}

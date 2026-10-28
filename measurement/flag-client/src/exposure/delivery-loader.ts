/**
 * How the client obtains the exposure delivery subsystem. Not part of the public API.
 *
 * Loading is on demand, so a client that logs nothing never downloads it and a client that does
 * keeps it off the critical path. The result is deliberately a value or a promise: tests, and any
 * host that has already supplied the subsystem, construct their logger synchronously.
 */
import type { createExposureEnvironment } from './environment';
import type { createExposureLogger } from './logger';
import type { mapExposureRecord } from './mapper';

/** The members of `./delivery` the client uses. */
export interface ExposureDelivery {
	readonly createExposureEnvironment: typeof createExposureEnvironment;
	readonly createExposureLogger: typeof createExposureLogger;
	readonly mapExposureRecord: typeof mapExposureRecord;
}

let supplied: ExposureDelivery | Promise<ExposureDelivery> | undefined;

/**
 * The delivery subsystem: the supplied one when there is one, and otherwise a promise for the
 * dynamically imported module. A client given a promise buffers its exposures until it resolves.
 */
export function loadExposureDelivery(): ExposureDelivery | Promise<ExposureDelivery> {
	return supplied ?? import('./delivery');
}

/**
 * Supply the delivery subsystem, or restore on-demand loading when called without one. Supplying the
 * module itself makes clients construct their logger synchronously; supplying a promise lets a test
 * decide when loading completes. For tests only; it is not exported from the package entry point.
 */
export function setExposureDelivery(delivery?: ExposureDelivery | Promise<ExposureDelivery>): void {
	supplied = delivery;
}

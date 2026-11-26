/**
 * How the client obtains the exposure delivery subsystem. Not part of the public API.
 *
 * The subsystem is imported statically. A dynamic import made the bundler split it into its own
 * chunk and add a chunk manifest that reads `import.meta.url`, which is a syntax error in a bundle
 * loaded as a classic script, such as Jira's early entry scripts. The result is still a value or a
 * promise: tests, and any host that has already supplied the subsystem, construct their logger
 * synchronously; otherwise the client buffers exposures until exposure hashing has initialized.
 */
import * as delivery from './delivery';
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
 * bundled module that resolves once exposure hashing has initialized. A client given a promise
 * buffers its exposures until it resolves.
 */
export function loadExposureDelivery(): ExposureDelivery | Promise<ExposureDelivery> {
	if (supplied !== undefined) return supplied;
	return delivery.initializeExposureHash().then((): ExposureDelivery => delivery);
}

/**
 * Supply the delivery subsystem, or restore the bundled one when called without one. Supplying the
 * module itself makes clients construct their logger synchronously; supplying a promise lets a test
 * decide when loading completes. For tests only; it is not exported from the package entry point.
 */
export function setExposureDelivery(delivery?: ExposureDelivery | Promise<ExposureDelivery>): void {
	supplied = delivery;
}

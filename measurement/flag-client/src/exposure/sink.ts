/**
 * Where a read sends its exposure: straight into the delivery subsystem, or into a buffer until that
 * subsystem has loaded. Not part of the public API.
 *
 * A sink takes the mapping input rather than a finished record, because the code that maps a record
 * is part of the subsystem being loaded.
 */
import type { ExposureDelivery } from './delivery-loader';
import type { ExposureLogger } from './logger';
import type { ExposureMappingInput } from './mapper';

/** The client's view of exposure telemetry. */
export interface ExposureSink {
	/** Queue an exposure unless its identity is within a deduplication window. */
	log(identityKey: string, input: ExposureMappingInput): void;
	/** End every deduplication window, as a successful replacement requires. */
	endDeduplicationWindows(): void;
}

/**
 * The most exposures a buffer holds, so a subsystem that never arrives cannot grow it without
 * bound. Beyond it the oldest exposure is dropped, matching the logger's preference for the newest.
 */
export const MAX_BUFFERED_EXPOSURES = 1000;

/** The sink of a client that logs nothing. It never touches network, storage, timers, or listeners. */
export const NOOP_EXPOSURE_SINK: ExposureSink = Object.freeze({
	log: () => undefined,
	endDeduplicationWindows: () => undefined,
});

/**
 * The sink of a loaded client. The record is mapped inside the logger's `produce` callback, so a
 * deduplicated exposure is still never mapped.
 */
export function deliveringSink(logger: ExposureLogger, delivery: ExposureDelivery): ExposureSink {
	return {
		log: (identityKey, input) => {
			logger.log(identityKey, () => delivery.mapExposureRecord(input));
		},
		endDeduplicationWindows: () => {
			logger.endDeduplicationWindows();
		},
	};
}

type BufferedOperation =
	| { readonly kind: 'log'; readonly identityKey: string; readonly input: ExposureMappingInput }
	| { readonly kind: 'endDeduplicationWindows' };

/**
 * The sink of a client whose delivery subsystem is still loading.
 *
 * Flags are read on the critical path, well before the subsystem arrives, so every exposure is held
 * with the timestamp and state its read observed and replayed in order once it has. Nothing is
 * dropped for arriving early.
 *
 * Deduplication therefore runs on replay, against the real logger's windows: a window starts when
 * the exposure is queued rather than when it was read. The shift is the subsystem's load time, against
 * a window of minutes, and which exposures survive deduplication is unchanged.
 */
export class BufferingExposureSink implements ExposureSink {
	private readonly operations: BufferedOperation[] = [];
	private held = 0;

	log(identityKey: string, input: ExposureMappingInput): void {
		this.operations.push({ kind: 'log', identityKey, input });
		this.held += 1;
		if (this.held > MAX_BUFFERED_EXPOSURES) {
			// The push above guarantees there is one to drop.
			this.operations.splice(
				this.operations.findIndex((operation) => operation.kind === 'log'),
				1,
			);
			this.held -= 1;
		}
	}

	endDeduplicationWindows(): void {
		this.operations.push({ kind: 'endDeduplicationWindows' });
	}

	/** Replay every held operation into `sink`, in the order the client performed them. */
	replayInto(sink: ExposureSink): void {
		const operations = this.operations.splice(0, this.operations.length);
		this.held = 0;
		for (const operation of operations) {
			if (operation.kind === 'log') {
				sink.log(operation.identityKey, operation.input);
			} else {
				sink.endDeduplicationWindows();
			}
		}
	}
}

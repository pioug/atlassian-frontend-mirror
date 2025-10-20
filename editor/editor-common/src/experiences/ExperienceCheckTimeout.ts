import { EXPERIENCE_FAILURE_REASON } from './consts';
import type { ExperienceCheck, ExperienceCheckCallback } from './ExperienceCheck';

/**
 * Check for the completion of an experience based on a timeout
 *
 * Will always result in failure after the timeout duration
 */
export class ExperienceCheckTimeout implements ExperienceCheck {
	private timeoutId: ReturnType<typeof setTimeout> | undefined;
	private maxDurationMs: number;

	constructor(maxDurationMs: number) {
		this.maxDurationMs = maxDurationMs;
	}

	start(callback: ExperienceCheckCallback) {
		this.stop();

		this.timeoutId = setTimeout(() => {
			callback({ status: 'failure', reason: EXPERIENCE_FAILURE_REASON.TIMEOUT });
		}, this.maxDurationMs);
	}

	stop() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
	}
}

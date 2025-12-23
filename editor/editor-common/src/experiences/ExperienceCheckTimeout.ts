import { EXPERIENCE_FAILURE_REASON } from './consts';
import type {
	ExperienceCheck,
	ExperienceCheckCallback,
	ExperienceCheckResult,
} from './ExperienceCheck';

export type ExperienceCheckTimeoutConfig = {
	/**
	 * Maximum duration in milliseconds before timing out
	 */
	durationMs: number;

	/**
	 * Optional callback to provide custom result on timeout
	 *
	 * If not provided, or callback returns undefined, defaults to failure with experienceFailureReason 'timeout'
	 */
	onTimeout?: () => ExperienceCheckResult | undefined;
};

const DEFAULT_FAILURE_RESULT: ExperienceCheckResult = {
	status: 'failure',
	reason: EXPERIENCE_FAILURE_REASON.TIMEOUT,
};

/**
 * Check for the completion of an experience based on a timeout
 *
 * By default, will result in failure with reason 'timeout' after the specified duration.
 *
 * Can be customized for different results on timeout via the onTimeout callback.
 */
export class ExperienceCheckTimeout implements ExperienceCheck {
	private timeoutId: ReturnType<typeof setTimeout> | undefined;
	private durationMs: number = 0;
	private onTimeout: () => ExperienceCheckResult | undefined;

	constructor({
		durationMs,
		onTimeout = () => DEFAULT_FAILURE_RESULT,
	}: ExperienceCheckTimeoutConfig) {
		this.durationMs = durationMs;
		this.onTimeout = onTimeout;
	}

	start(callback: ExperienceCheckCallback): void {
		this.stop();

		this.timeoutId = setTimeout(() => {
			const result = this.onTimeout() || DEFAULT_FAILURE_RESULT;
			callback(result);
		}, this.durationMs);
	}

	stop(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
	}
}

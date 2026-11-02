import { bind, type UnbindFn } from 'bind-event-listener';

import { ResponseError } from '@atlaskit/feature-gate-fetcher/errors';
import { getEvalFlagsStatus } from '@atlaskit/feature-gate-fetcher/Fetcher';
import type { EvalFlagsResponse, FetcherOptions } from '@atlaskit/feature-gate-fetcher/types';
import type { EvalFlagsStatus } from '@atlaskit/feature-gate-js-client/types';

import { type ExperimentValuesEntry, type RulesetProfile } from '../database/types';
import { type PollingConfig, type ProviderOptions } from './types';
import { fetchFlagValues, getValidatedPollingInterval, isRetryableFetchError } from './utils';

// 5 min
export const EXPERIMENT_VALUES_STALE_TIMEOUT_MS: number = 1000 * 60 * 5;

export const SCHEDULER_OPTIONS_DEFAULT: PollingConfig = {
	minWaitInterval: 300_000, // 300 second = 5 mins
	maxWaitInterval: 1200_000, // 1200 second = 20 mins
	backOffFactor: 2,
	backOffJitter: 0.1, // Jitter is upto 10% of wait time
	interval: 300_000, // 300 second = 5 mins
	tabHiddenPollingFactor: 12, // for hidden tabs, use hiddenTabFactor * interval for polling = 1 hour (default)
	maxInstantRetryTimes: 0,
};

/**
 * Retry schedule for when the service reports a provider as `UNAVAILABLE`: the first retry is after
 * this delay, then the delay doubles (with the polling jitter), capped at the polling interval.
 */
export const UNAVAILABLE_RETRY_MIN_WAIT_INTERVAL_MS = 30_000;

export const NO_CACHE_RETRY_OPTIONS_DEFAULT: PollingConfig = {
	...SCHEDULER_OPTIONS_DEFAULT,
	minWaitInterval: 500,
	interval: 500,
	maxInstantRetryTimes: 1,
};

export default class Refresh {
	private timerId: number | undefined;

	private readonly pollingConfig: PollingConfig;

	private readonly noCachePollingConfig: PollingConfig;

	private failureCount = 0;

	/** Consecutive fetches in which the service reported a provider as `UNAVAILABLE`. */
	private unavailableCount = 0;

	/** When the next retry for an `UNAVAILABLE` provider is due. */
	private unavailableRetryAt = 0;

	private profileHash: string | undefined;

	private rulesetProfile: RulesetProfile | undefined;

	private onExperimentValuesUpdate: (response: ExperimentValuesEntry) => void;

	private clientVersion: string | undefined;

	private lastUpdateTimestamp: number = 0;

	private providerOptions: ProviderOptions;

	private hasIntervalBeenValidated: boolean = false;

	unbind: UnbindFn | undefined;

	constructor(
		providerOptions: ProviderOptions,
		onExperimentValuesUpdate: (response: ExperimentValuesEntry) => void,
	) {
		this.onExperimentValuesUpdate = onExperimentValuesUpdate;
		this.pollingConfig = {
			...SCHEDULER_OPTIONS_DEFAULT,
			interval: providerOptions.pollingInterval ?? SCHEDULER_OPTIONS_DEFAULT.interval,
			maxInstantRetryTimes: 0, // Force this to 0 so this never reschedules instantly with cache
		};
		this.noCachePollingConfig = NO_CACHE_RETRY_OPTIONS_DEFAULT;
		this.providerOptions = providerOptions;
		this.visibilityChangeHandler = this.visibilityChangeHandler.bind(this);
	}

	// start refresh by fetchAndReschedule
	start(): void {
		this.stop();
		this.bindVisibilityChange();
		this.fetchAndReschedule();
	}

	// cancel pending schedule
	stop(): void {
		if (this.timerId) {
			window.clearTimeout(this.timerId);
			this.timerId = undefined;
			this.unbindVisibilityChange();
		}
	}

	updateProfile(
		profileHash: string,
		rulesetProfile: RulesetProfile,
		lastUpdateTimestamp: number = 0,
	): void {
		this.profileHash = profileHash;
		this.rulesetProfile = rulesetProfile;
		this.lastUpdateTimestamp = this.adjustBasedOnStaleness(lastUpdateTimestamp);
		this.failureCount = 0;
		this.unavailableCount = 0;
		this.unavailableRetryAt = 0;
	}

	/**
	 * Records the provider health of values for the current profile, whether fetched by this instance,
	 * by the provider's initial fetch, or by another tab. While a provider is `UNAVAILABLE`, the
	 * service is called again sooner than the polling interval, backing off until it recovers.
	 * `DISABLED` providers are not retried.
	 */
	setFetchedStatus(status: EvalFlagsStatus): void {
		if (status.statsig !== 'UNAVAILABLE' && status.ffp !== 'UNAVAILABLE') {
			this.unavailableCount = 0;
			this.unavailableRetryAt = 0;
			return;
		}
		this.unavailableCount += 1;
		this.unavailableRetryAt = Date.now() + this.calculateUnavailableRetryDelay();
	}

	// update version and timestamp
	setClientVersion(clientVersion: string): void {
		this.clientVersion = clientVersion;
	}
	setTimestamp(lastUpdateTimestamp: number): void {
		this.lastUpdateTimestamp = this.adjustBasedOnStaleness(lastUpdateTimestamp);
	}

	private adjustBasedOnStaleness(timestamp: number): number {
		return Date.now() - timestamp >= EXPERIMENT_VALUES_STALE_TIMEOUT_MS ? 0 : timestamp;
	}

	private visibilityChangeHandler(): void {
		// cancel existing schedule
		window.clearTimeout(this.timerId);
		this.timerId = undefined;
		// get current tab hidden state (for unsupported browser isTabHidden() will return false), so
		// if isTabHidden true: create a new schedule with a longer interval
		// if isTabHidden false: do a fetchAndReschedule (conditional do a fetch, schedule with normal interval)
		if (Refresh.isTabHidden()) {
			this.schedule();
		} else {
			this.fetchAndReschedule();
		}
	}

	private static isTabHidden(): boolean {
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- visibilityState is read from the active document
		return document.visibilityState === 'hidden';
	}

	// bind tab visibility change callback
	private bindVisibilityChange(): void {
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- page visibility listener is bound on document
		this.unbind = bind(document, {
			type: 'visibilitychange',
			listener: this.visibilityChangeHandler,
		});
	}

	// unbind tab visibility change callback
	private unbindVisibilityChange(): void {
		if (this.unbind) {
			this.unbind();
		}
	}

	// schedule a fetchAndReschedule
	private schedule(): void {
		this.timerId = window.setTimeout(() => {
			this.fetchAndReschedule();
		}, this.calculateInterval());
	}

	// conditional fetch ffs via fetcher, and schedule another fetchAndReschedule unless we have 400/401 from ffs
	private fetchAndReschedule(): void {
		if (!this.clientVersion) {
			throw new Error('Client version has not been set');
		}
		if (!this.profileHash || !this.rulesetProfile) {
			throw new Error('Profile has not been set');
		}

		const fetchedProfileHash = this.profileHash;
		const fetchedRulesetProfile = this.rulesetProfile;

		const { environment, targetApp, perimeter } = this.rulesetProfile;
		const { apiKey, useGatewayURL, includeFfpFlags } = this.providerOptions;

		// validate the polling interval is not too short based on the environment
		this.pollingConfig.interval = getValidatedPollingInterval(
			this.pollingConfig.interval,
			environment,
			!this.hasIntervalBeenValidated,
		);
		// set this to true after first validation to prevent multiple info logs
		this.hasIntervalBeenValidated = true;

		const fetcherOptions: FetcherOptions = {
			environment,
			targetApp,
			perimeter,
			apiKey,
			useGatewayURL,
			includeFfpFlags,
		};

		if (this.isFetchRequired()) {
			fetchFlagValues(this.clientVersion, fetcherOptions, this.rulesetProfile)
				.then((resp: EvalFlagsResponse) => {
					if (fetchedProfileHash === this.profileHash) {
						this.failureCount = 0;
						this.onExperimentValuesUpdate({
							profileHash: fetchedProfileHash,
							rulesetProfile: fetchedRulesetProfile,
							evalFlagsResponse: resp,
							timestamp: Date.now(),
						});
						this.setFetchedStatus(getEvalFlagsStatus(resp));
						this.schedule();
					}
				})
				.catch((err: Error) => {
					// 4xx (other than 408 and 429) means the request is invalid, e.g. the client info or apiKey,
					// so it is not retried until the profile changes.
					// Other errors are retried with backoff.
					if (!isRetryableFetchError(err)) {
						const status = err instanceof ResponseError ? err.status : undefined;
						const body = err instanceof ResponseError ? err.body : undefined;
						const message = `Feature flag service returned ${status}, "${body}". This request will not be retried until the profile data has been changed.`;
						// eslint-disable-next-line no-console
						console.error(message);
					} else {
						this.failureCount += 1;
						this.schedule();
					}
				});
		} else {
			this.schedule();
		}
	}

	private isFetchRequired(): boolean {
		if (this.unavailableCount > 0 && Date.now() >= this.unavailableRetryAt) {
			return true;
		}
		return Date.now() - this.getPollingConfig().interval >= this.lastUpdateTimestamp;
	}

	// The interval between polls when the last fetch succeeded
	private getPollingInterval(): number {
		const { interval, tabHiddenPollingFactor } = this.getPollingConfig();
		return Refresh.isTabHidden() ? interval * tabHiddenPollingFactor : interval;
	}

	private applyJitter(ms: number): number {
		const { backOffJitter } = this.getPollingConfig();
		if (!backOffJitter) {
			return ms;
		}
		const rand = Math.random();
		const deviation = Math.floor(rand * backOffJitter * ms);
		return Math.floor(rand * 10) < 5 ? ms - deviation : ms + deviation;
	}

	// The delay before retrying a provider reported as UNAVAILABLE, based on how many times in a row it was
	private calculateUnavailableRetryDelay(): number {
		const { backOffFactor } = this.getPollingConfig();
		const ms = this.applyJitter(
			UNAVAILABLE_RETRY_MIN_WAIT_INTERVAL_MS * backOffFactor ** (this.unavailableCount - 1),
		);
		return Math.min(ms, this.getPollingInterval());
	}

	// calculate wait interval based on failure count
	private calculateInterval(): number {
		const {
			interval,
			tabHiddenPollingFactor,
			minWaitInterval,
			maxWaitInterval,
			backOffFactor,
			maxInstantRetryTimes,
		} = this.getPollingConfig();

		if (
			maxInstantRetryTimes !== undefined &&
			maxInstantRetryTimes !== 0 &&
			maxInstantRetryTimes >= this.failureCount
		) {
			return 0;
		}

		if (this.failureCount === 0) {
			const pollingInterval = Refresh.isTabHidden() ? interval * tabHiddenPollingFactor : interval;
			if (this.unavailableCount > 0) {
				return Math.max(0, Math.min(this.unavailableRetryAt - Date.now(), pollingInterval));
			}
			return pollingInterval;
		}
		const ms = this.applyJitter(minWaitInterval * backOffFactor ** (this.failureCount - 1));
		return Number(Math.min(ms, maxWaitInterval));
	}

	private getPollingConfig(): PollingConfig {
		if (this.lastUpdateTimestamp === 0) {
			return this.noCachePollingConfig;
		}
		return this.pollingConfig;
	}
}

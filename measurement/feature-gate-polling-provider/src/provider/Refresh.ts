import { bind, type UnbindFn } from 'bind-event-listener';

import Fetcher, {
	type FetcherOptions,
	type FrontendExperimentsResponse,
	ResponseError,
} from '@atlaskit/feature-gate-fetcher';

import { type ExperiemntValuesEntry, type RulesetProfile } from '../database/types';

import { type PollingConfig, type ProviderOptions } from './types';

export const SCHEDULER_OPTIONS_DEFAULT: PollingConfig = {
	minWaitInterval: 300000, // 300 second = 5 mins
	maxWaitInterval: 1200000, // 1200 second = 20 mins
	backOffFactor: 2,
	backOffJitter: 0.1, // Jitter is upto 10% of wait time
	interval: 300000, // 300 second = 5 mins
	tabHiddenPollingFactor: 12, // for hidden tabs, use hiddenTabFactor * interval for polling = 1 hour (default)
	maxInstantRetryTimes: 0,
};

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

	private profileHash: string | undefined;

	private rulesetProfile: RulesetProfile | undefined;

	private onExperimentValuesUpdate: (response: ExperiemntValuesEntry) => void;

	private clientVersion: string | undefined;

	private lastUpdateTimestamp: number = 0;

	private providerOptions: ProviderOptions;
	unbind: UnbindFn | undefined;

	constructor(
		providerOptions: ProviderOptions,
		onExperimentValuesUpdate: (response: ExperiemntValuesEntry) => void,
	) {
		this.onExperimentValuesUpdate = onExperimentValuesUpdate;
		this.pollingConfig = {
			...SCHEDULER_OPTIONS_DEFAULT,
			interval: providerOptions.pollingInterval ?? SCHEDULER_OPTIONS_DEFAULT.interval,
			maxInstantRetryTimes: 0, // Force this to 0 so this never reschedules instantly with cache
		};
		this.noCachePollingConfig = {
			...NO_CACHE_RETRY_OPTIONS_DEFAULT,
			interval: providerOptions.pollingInterval ?? NO_CACHE_RETRY_OPTIONS_DEFAULT.interval,
		};
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
		this.lastUpdateTimestamp = lastUpdateTimestamp;
		this.failureCount = 0;
	}

	// update version and timestamp
	setClientVersion(clientVersion: string): void {
		this.clientVersion = clientVersion;
	}
	setTimestamp(lastUpdateTimestamp: number): void {
		this.lastUpdateTimestamp = lastUpdateTimestamp;
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
		return document.visibilityState === 'hidden';
	}

	// bind tab visibility change callback
	private bindVisibilityChange(): void {
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
		const { apiKey, useGatewayURL } = this.providerOptions;

		const fetcherOptions: FetcherOptions = {
			environment,
			targetApp,
			perimeter,
			apiKey,
			useGatewayURL,
		};

		if (this.isFetchRequired()) {
			Fetcher.fetchExperimentValues(
				this.clientVersion,
				fetcherOptions,
				this.rulesetProfile.identifiers,
				this.rulesetProfile.customAttributes,
			)
				.then((resp: FrontendExperimentsResponse) => {
					if (fetchedProfileHash === this.profileHash) {
						this.failureCount = 0;
						this.onExperimentValuesUpdate({
							profileHash: fetchedProfileHash,
							rulesetProfile: fetchedRulesetProfile,
							experimentValuesResponse: resp,
							timestamp: Date.now(),
						});
						this.schedule();
					}
				})
				.catch((err: Error) => {
					// 401 means client info or apiKey invalid, will have no retry
					// 400 means request body invalid, will have at most `maxInstantRetryTimes` instant retries
					// other 4xx or 5xx will do `maxInstantRetryTimes` instant retries and continue to do backoff retries
					if (err instanceof ResponseError && [400, 401].includes(err.status)) {
						// no retry needed
						const message = `Feature flag service returned ${err.status}, "${err.body}". This request will not be retried until the profile data has been changed.`;
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
		return Date.now() - this.getPollingConfig().interval >= this.lastUpdateTimestamp;
	}

	// calculate wait interval based on failure count
	private calculateInterval(): number {
		const {
			interval,
			tabHiddenPollingFactor,
			minWaitInterval,
			maxWaitInterval,
			backOffFactor,
			backOffJitter,
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
			return Refresh.isTabHidden() ? interval * tabHiddenPollingFactor : interval;
		}
		let ms = minWaitInterval * backOffFactor ** (this.failureCount - 1);
		if (backOffJitter) {
			const rand = Math.random();
			const deviation = Math.floor(rand * backOffJitter * ms);
			if (Math.floor(rand * 10) < 5) {
				ms -= deviation;
			} else {
				ms += deviation;
			}
		}
		return Number(Math.min(ms, maxWaitInterval));
	}

	private getPollingConfig(): PollingConfig {
		if (this.lastUpdateTimestamp === 0) {
			return this.noCachePollingConfig;
		}
		return this.pollingConfig;
	}
}

import {
	type LastInteractionFinishInfo,
	type PostInteractionLogOutput,
	type ReactProfilerTiming,
} from '../common/common/types';
import type { VCResult } from '../common/vc/types';
import { getConfig } from '../config';
import type { LabelStack } from '../interaction-context';
import { VCObserverWrapper } from '../vc';
import type { VCObserverInterface, VCObserverOptions } from '../vc/types';

const POST_INTERACTION_LOG_SEND_DEFAULT_TIMEOUT = 3000;

export default class PostInteractionLog {
	/**
	 * Basic info about interaction that has just finished
	 */
	lastInteractionFinish: LastInteractionFinishInfo | null = null;

	/**
	 * Array of observed react render timings
	 */
	reactProfilerTimings: ReactProfilerTiming[] = [];

	/**
	 * Store the scheduled sink timeout Id so that it can be cancelled when needed
	 */
	sinkTimeoutId: number | null = null;

	/**
	 * independent VC observer, that observes until `custom.post-interaction-logs` event is sent
	 */
	vcObserver: VCObserverInterface | null = null;

	vcObserverSSRConfig: {
		ssr: number | undefined;
	} | null = null;

	lastInteractionFinishVCResult?: VCResult;

	initializeVCObserver(options: VCObserverOptions) {
		this.vcObserver = new VCObserverWrapper({ ...options, isPostInteraction: true });
	}

	startVCObserver({ startTime }: { startTime: number }) {
		this.vcObserver?.start({ startTime });
	}

	setVCObserverSSRConfig(
		vcObserverSSRConfig: {
			ssr: number | undefined;
		} | null,
	) {
		this.vcObserverSSRConfig = vcObserverSSRConfig;
	}

	/**
	 * Set the VC result as per the last interaction
	 * Used to compare diffs of VC updates vs post interaction VC observer
	 * @param result - VC result as calculated by UFO create payload
	 */
	setLastInteractionFinishVCResult(result: VCResult) {
		this.lastInteractionFinishVCResult = result;
	}

	/**
	 * Handler function to process / send the observation data
	 */
	sinkHandlerFn: (output: PostInteractionLogOutput) => void | Promise<void> = () => {};

	/**
	 * Set the fn that would be invoked to process / send the observation data
	 */
	sinkHandler(sinkHandlerFn: (output: PostInteractionLogOutput) => void | Promise<void>) {
		this.sinkHandlerFn = sinkHandlerFn;
	}

	/**
	 * Reset state of the log
	 */
	reset() {
		this.lastInteractionFinish = null;
		this.reactProfilerTimings = [];

		if (this.sinkTimeoutId != null) {
			clearTimeout(this.sinkTimeoutId);
			this.sinkTimeoutId = null;
		}

		this.setVCObserverSSRConfig(null);
	}

	/**
	 * Check if there is data in the log
	 */
	hasData() {
		return this.reactProfilerTimings?.length > 0;
	}

	/**
	 * Send the log if there is data
	 */
	async sendPostInteractionLog() {
		if (!this.hasData() || !this.lastInteractionFinish || !this.sinkHandlerFn) {
			this.reset();
			if (getConfig()?.experimentalInteractionMetrics?.enabled) {
				this.vcObserver?.stop();
			}
			return;
		}

		const postInteractionFinishVCResult = await this.vcObserver?.getVCResult({
			start: this.lastInteractionFinish.start,
			stop: performance.now(),
			tti: -1, // no need for TTI value here
			isEventAborted: !!this.lastInteractionFinish.abortReason,
			prefix: 'ufo',
			...this.vcObserverSSRConfig,
			experienceKey: this.lastInteractionFinish.ufoName,
		});

		if (getConfig()?.experimentalInteractionMetrics?.enabled) {
			this.vcObserver?.stop();
		}

		this.sinkHandlerFn({
			lastInteractionFinish: this.lastInteractionFinish,
			reactProfilerTimings: this.reactProfilerTimings,
			postInteractionFinishVCResult,
			lastInteractionFinishVCResult: this.lastInteractionFinishVCResult,
		});

		this.reset();
	}

	/**
	 * This fn should be invoked when an interaction has finished
	 * Basic details about the finished interaction will be recorded
	 * A timeout will be setup to send the post interaction observation after some time.
	 */
	onInteractionComplete({
		ufoName,
		start,
		end,
		id,
		abortReason,
		abortedByInteractionName,
		routeName,
		type,
		experimentalTTAI,
		experimentalVC90,
		errors,
	}: LastInteractionFinishInfo) {
		this.lastInteractionFinish = {
			ufoName,
			start,
			end,
			id,
			abortReason,
			abortedByInteractionName,
			routeName,
			type,
			experimentalTTAI,
			experimentalVC90,
			errors,
		};

		const timeout =
			getConfig()?.timeWindowForLateMutationsInMilliseconds ||
			POST_INTERACTION_LOG_SEND_DEFAULT_TIMEOUT;

		this.sinkTimeoutId = window.setTimeout(async () => {
			await this.sendPostInteractionLog();
		}, timeout);
	}

	/**
	 * This fn should be invoked when a React render happens after interaction has finished
	 */
	addProfilerTimings(
		labelStack: LabelStack,
		type: 'mount' | 'update' | 'nested-update',
		actualDuration: number,
		baseDuration: number,
		startTime: number,
		commitTime: number,
	) {
		if (this.lastInteractionFinish != null) {
			this.reactProfilerTimings.push({
				type,
				actualDuration,
				baseDuration,
				startTime,
				commitTime,
				labelStack,
			});
		}
	}
}

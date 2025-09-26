import { fg } from '@atlaskit/platform-feature-flags';

import {
	type HoldActive,
	type LastInteractionFinishInfo,
	type PostInteractionLogOutput,
	type ReactProfilerTiming,
} from '../common/common/types';
import type { VCResult } from '../common/vc/types';
import { getConfig } from '../config';
import { getPageVisibilityState } from '../hidden-timing';
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

	holdInfo: HoldActive[] = [];

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

	stopVCObserver() {
		this.vcObserver?.stop();
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
		this.holdInfo = [];

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
		if (
			!this.lastInteractionFinish ||
			!this.sinkHandlerFn ||
			(!this.hasData() && !fg('platform_ufo_always_send_post_interaction_log'))
		) {
			this.reset();
			this.vcObserver?.stop();
			return;
		}

		const pageVisibilityState = getPageVisibilityState(
			this.lastInteractionFinish.start,
			this.lastInteractionFinish.end,
		);

		const isPageVisible = pageVisibilityState === 'visible';

		const config = getConfig();
		const postInteractionFinishVCResult = await this.vcObserver?.getVCResult({
			start: this.lastInteractionFinish.start,
			stop: performance.now(),
			tti: -1, // no need for TTI value here
			isEventAborted: !!this.lastInteractionFinish.abortReason,
			prefix: 'ufo',
			experienceKey: this.lastInteractionFinish.ufoName,
			interactionId: this.lastInteractionFinish.id,
			includeSSRInV3: config?.vc?.includeSSRInV3,
			includeSSRRatio: config?.vc?.includeSSRRatio,
			...this.vcObserverSSRConfig,
			interactionType: this.lastInteractionFinish.type,
			isPageVisible,
			interactionAbortReason: this.lastInteractionFinish.abortReason,
		});

		this.vcObserver?.stop();

		this.sinkHandlerFn({
			lastInteractionFinish: this.lastInteractionFinish,
			reactProfilerTimings: this.reactProfilerTimings,
			postInteractionFinishVCResult,
			lastInteractionFinishVCResult: this.lastInteractionFinishVCResult,
			postInteractionHoldInfo: this.holdInfo,
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

	addHoldInfo(labelStack: LabelStack, name: string, start: number) {
		this.holdInfo.push({ name, labelStack, start });
	}
}

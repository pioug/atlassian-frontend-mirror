import { type VCResult } from '../common/vc/types';
import { VCObserverWrapper } from '../vc';
import type { VCObserverInterface, VCObserverOptions } from '../vc/types';

import { interactions } from './common/constants';

import { type InteractionMetrics, remove } from './index';

export default class InteractionExtraMetrics {
	// Store the finished interaction (as non-3p interaction)
	finishedInteraction: InteractionMetrics | null = null;
	// independent VC observer, that observes until `custom.post-interaction-logs` event is sent
	vcObserver: VCObserverInterface | null = null;
	// Store the finished interaction's VC result
	lastInteractionFinishVCResult?: VCResult;

	private sinkHandlerFn: (
		interactionId: string,
		interaction: InteractionMetrics,
		lastInteractionFinish: InteractionMetrics | null,
		lastInteractionFinishVCResult?: VCResult,
	) => void | Promise<void> = () => {};

	initializeVCObserver(options: VCObserverOptions) {
		this.vcObserver = new VCObserverWrapper({ ...options, isPostInteraction: true });
	}

	startVCObserver({ startTime }: { startTime: number }, interactionId: string) {
		if (this.eligibleToMeasure(interactionId)) {
			this.vcObserver?.start({ startTime });
		}
	}

	stopVCObserver() {
		this.vcObserver?.stop();
	}

	// Check if the current interaction is eligible for measurement
	eligibleToMeasure(interactionId: string): boolean {
		const interaction = interactions.get(interactionId);
		return interaction?.type === 'page_load' || interaction?.type === 'transition';
	}

	updateFinishedInteraction(interaction: InteractionMetrics) {
		if (interaction?.type === 'page_load' || interaction?.type === 'transition') {
			this.finishedInteraction = interaction;
		}
	}

	setLastInteractionFinishVCResult(result: VCResult) {
		this.lastInteractionFinishVCResult = result;
	}

	sinkHandler(
		fn: (
			interactionId: string,
			interaction: InteractionMetrics,
			lastInteractionFinish: InteractionMetrics | null,
			lastInteractionFinishVCResult?: VCResult,
		) => void | Promise<void>,
	) {
		this.sinkHandlerFn = fn;
	}

	onInteractionComplete(id: string, data: InteractionMetrics) {
		if (data.ufoName) {
			const updatedData = {
				...data,
				vcObserver: this.vcObserver ?? undefined,
			};
			this.sinkHandlerFn(
				id,
				updatedData,
				this.finishedInteraction,
				this.lastInteractionFinishVCResult,
			);
		}
		this.stopVCObserver();
		remove(id);
		this.reset();
	}

	reset() {
		this.stopVCObserver();
		if (this.finishedInteraction?.id) {
			remove(this.finishedInteraction.id);
		}
		this.finishedInteraction = null;
		this.lastInteractionFinishVCResult = undefined;
	}

	stopAll(id: string) {
		remove(id);
		this.reset();
	}
}

import { VCObserverWrapper } from '../vc';
import type { VCObserverInterface, VCObserverOptions } from '../vc/types';

import { interactions } from './common/constants';

import { type InteractionMetrics, remove } from './index';

export default class InteractionExtraMetrics {
	// Store the finished interaction ID (as non-3p interaction)
	finishedInteractionId: string | null = null;
	// independent VC observer, that observes until `custom.post-interaction-logs` event is sent
	vcObserver: VCObserverInterface | null = null;

	private sinkHandlerFn: (
		interactionId: string,
		interaction: InteractionMetrics,
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

	updateFinishedInteractionId(interactionId: string) {
		if (this.eligibleToMeasure(interactionId)) {
			this.finishedInteractionId = interactionId;
		}
	}

	sinkHandler(
		fn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
	) {
		this.sinkHandlerFn = fn;
	}

	onInteractionComplete(id: string, data: InteractionMetrics) {
		if (data.ufoName) {
			const updatedData = {
				...data,
				vcObserver: this.vcObserver ?? undefined,
			};
			this.sinkHandlerFn(id, updatedData);
		}
		this.stopVCObserver();
		remove(id);
		this.reset();
	}

	reset() {
		this.finishedInteractionId = null;
	}

	stopAll(id: string) {
		this.stopVCObserver();
		remove(id);
		this.reset();
	}
}

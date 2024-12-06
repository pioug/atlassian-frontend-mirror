import type { InteractionMetrics } from '../common';
import { createInteractionMetricsPayload, getUfoNameOverride } from '../create-payload';
import { VCObserver, type VCObserverOptions } from '../vc/vc-observer';

export class ExperimentalInteractionMetrics {
	/**
	 * Handler function to process / send the observation data
	 */
	sinkHandlerFn: (
		interactionId: string,
		interactionMetrics: InteractionMetrics,
	) => void | Promise<void> = () => {};

	/**
	 * Set the fn that would be invoked to process / send the observation data
	 */
	sinkHandler(
		sinkHandlerFn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
	) {
		this.sinkHandlerFn = sinkHandlerFn;
	}

	onInteractionComplete(
		interactionId: string,
		data: InteractionMetrics,
		endTime = performance.now(),
	) {
		if (data.ufoName) {
			data.end = endTime;
			this.sinkHandlerFn(interactionId, data);
		}
	}

	/**
	 * independent VC observer that observes until `custom.post-interaction-logs` event is sent
	 */
	vcObserver: VCObserver | null = null;

	initializeVCObserver(options: VCObserverOptions) {
		if (this.vcObserver === null) {
			this.vcObserver = new VCObserver({ ...options, isPostInteraction: true });
		}
		return this;
	}

	startVCObserver({ startTime }: { startTime: number }) {
		this.vcObserver?.start({ startTime });
	}
}

export function createPayload(interactionId: string, interaction: InteractionMetrics) {
	const ufoNameOverride = getUfoNameOverride(interaction);
	const modifiedInteraction = { ...interaction, ufoName: ufoNameOverride };
	return createInteractionMetricsPayload(modifiedInteraction, interactionId, true);
}

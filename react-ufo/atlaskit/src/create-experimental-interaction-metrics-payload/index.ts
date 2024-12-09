import coinflip from '../coinflip';
import type { InteractionMetrics } from '../common';
import { getConfig, getExperimentalInteractionRate } from '../config';
import { createInteractionMetricsPayload, getUfoNameOverride } from '../create-payload';
import { getPageVisibilityState } from '../hidden-timing';
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

export function createExperimentalInteractionMetricsPayload(
	interactionId: string,
	interaction: InteractionMetrics,
) {
	const config = getConfig();

	if (!config) {
		throw Error('UFO Configuration not provided');
	}

	const ufoName = getUfoNameOverride(interaction);
	const modifiedInteraction = { ...interaction, ufoName };
	const rate = getExperimentalInteractionRate(ufoName, interaction.type);

	if (!coinflip(rate)) {
		return null;
	}

	const pageVisibilityState = getPageVisibilityState(interaction.start, interaction.end);

	if (pageVisibilityState !== 'visible') {
		return null;
	}

	return createInteractionMetricsPayload(modifiedInteraction, interactionId, true);
}

import type { InteractionMetrics } from '../common';
import { getPageVisibilityState } from '../hidden-timing';
import { VCObserver, type VCObserverOptions } from '../vc/vc-observer';

type InteractionMetricsHandler = (
	interactionId: string,
	interaction: InteractionMetrics,
) => void | Promise<void>;

const interactionBuffer: { interactionId: string; data: InteractionMetrics }[] = [];

let bufferInteractionData: (interactionId: string, data: InteractionMetrics) => void = (
	interactionId,
	data,
) => {
	interactionBuffer.push({ interactionId, data });
};

function clearInteractionBuffer() {
	interactionBuffer.length = 0;
}

function appendInteractionData(interactionId: string, data: InteractionMetrics) {
	bufferInteractionData(interactionId, data);
}

export function installInteractionSink(handler: InteractionMetricsHandler) {
	for (const { interactionId, data } of interactionBuffer) {
		handler(interactionId, data);
	}
	clearInteractionBuffer();

	bufferInteractionData = handler;
}

export function sinkExperimentalHandler(
	sinkFn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
) {
	installInteractionSink(sinkFn);
}

export function onExperimentalInteractionComplete(
	interactionId: string,
	data: InteractionMetrics,
	endTime = performance.now(),
) {
	if (data.ufoName) {
		data.end = endTime;
		appendInteractionData(interactionId, data);
		clearInteractionBuffer();
	}
}

export class ExperimentalVCMetrics {
	vcObserver: VCObserver | null = null;

	initialize(options: VCObserverOptions) {
		if (this.vcObserver === null) {
			this.vcObserver = new VCObserver({ ...options, isPostInteraction: true });
		}
		return this;
	}

	start({ startTime }: { startTime: number }) {
		this.vcObserver?.start({ startTime });
	}
}

export const experimentalVC = new ExperimentalVCMetrics();

export const getExperimentalVCMetrics = (interaction: InteractionMetrics) => {
	if (experimentalVC.vcObserver) {
		const prefix = 'ufo-experimental';

		const result = experimentalVC.vcObserver.getVCResult({
			start: interaction.start,
			stop: interaction.end,
			tti: interaction.apdex?.[0]?.stopTime,
			prefix,
			vc: interaction.vc,
		});

		const VC = result?.['metrics:vc'] as {
			[key: string]: number | null;
		};

		if (!VC || !result?.[`${prefix}:vc:clean`]) {
			return result;
		}

		const pageVisibilityUpToTTAI = getPageVisibilityState(interaction.start, interaction.end);

		if (interaction.abortReason || pageVisibilityUpToTTAI !== 'visible') {
			return result;
		}

		return {
			...result,
			'metric:experimental:vc90': VC['90'],
		};
	}
	return null;
};

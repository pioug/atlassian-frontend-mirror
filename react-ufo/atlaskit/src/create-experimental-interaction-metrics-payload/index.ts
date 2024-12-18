import type { InteractionMetrics } from '../common';
import { calculateVCMetrics } from '../create-payload/common/utils';
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
		const result = calculateVCMetrics(
			interaction,
			'ufo-experimental',
			experimentalVC.vcObserver.getVCResult,
		);
		experimentalVC.vcObserver.stop();
		return {
			...result,
			'metric:experimental:vc90': result?.['metrics:vc']?.['90'],
		};
	}
	return null;
};

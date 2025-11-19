import type { InteractionMetrics } from '../common';

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

function installInteractionSink(handler: InteractionMetricsHandler) {
	for (const { interactionId, data } of interactionBuffer) {
		handler(interactionId, data);
	}
	clearInteractionBuffer();

	bufferInteractionData = handler;
}

export function sinkExtraSearchPageInteractionHandler(
	sinkFn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
): void {
	installInteractionSink(sinkFn);
}

export function onSearchPageInteractionComplete(
	interactionId: string,
	data: InteractionMetrics,
): void {
	if (data.ufoName) {
		appendInteractionData(interactionId, data);
		clearInteractionBuffer();
	}
}

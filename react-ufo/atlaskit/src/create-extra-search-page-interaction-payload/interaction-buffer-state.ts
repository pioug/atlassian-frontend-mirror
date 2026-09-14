import type { InteractionMetrics } from '../common';

type InteractionMetricsHandler = (
	interactionId: string,
	interaction: InteractionMetrics,
) => void | Promise<void>;

const interactionBuffer: { interactionId: string; data: InteractionMetrics }[] = [];

export const interactionBufferState: {
	interactionBuffer: { interactionId: string; data: InteractionMetrics }[];
	bufferInteractionData: InteractionMetricsHandler;
} = {
	interactionBuffer,
	bufferInteractionData: (interactionId, data) => {
		interactionBuffer.push({ interactionId, data });
	},
};

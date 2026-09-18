import type { InteractionMetrics } from '../common';
import { interactionBufferState } from './interaction-buffer-state';

export function sinkExtraSearchPageInteractionHandler(
	sinkFn: (interactionId: string, interaction: InteractionMetrics) => void | Promise<void>,
): void {
	for (const { interactionId, data } of interactionBufferState.interactionBuffer) {
		sinkFn(interactionId, data);
	}
	interactionBufferState.interactionBuffer.length = 0;
	interactionBufferState.bufferInteractionData = sinkFn;
}

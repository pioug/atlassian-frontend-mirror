import type { InteractionMetrics } from '../common';
import { interactionBufferState } from './interaction-buffer-state';

export function onSearchPageInteractionComplete(
	interactionId: string,
	data: InteractionMetrics,
): void {
	if (data.ufoName) {
		interactionBufferState.bufferInteractionData(interactionId, data);
		interactionBufferState.interactionBuffer.length = 0;
	}
}

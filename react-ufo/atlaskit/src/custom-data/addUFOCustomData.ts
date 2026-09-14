import { getInteractionId } from '../interaction-id-context/getInteractionId';
import { addCustomData, type CustomData } from '../interaction-metrics';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function addUFOCustomData(data: CustomData): void {
	const interactionId = getInteractionId();
	const currentInteractionId = interactionId.current;
	if (!currentInteractionId) {
		return;
	}

	if (typeof globalThis?.structuredClone === 'function') {
		addCustomData(currentInteractionId, [], globalThis.structuredClone(data));
	} else {
		addCustomData(currentInteractionId, [], data);
	}
}

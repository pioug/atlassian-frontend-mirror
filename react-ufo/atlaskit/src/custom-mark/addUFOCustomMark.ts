import { getInteractionId } from '../interaction-id-context/getInteractionId';
import { addMark } from '../interaction-metrics';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function addUFOCustomMark(name: string, timestamp?: number): void {
	const interactionId = getInteractionId();
	const currentInteractionId = interactionId.current;

	if (!currentInteractionId) {
		return;
	}
	const time = timestamp || performance.now();
	addMark(currentInteractionId, 'custom', name, [], time);
}

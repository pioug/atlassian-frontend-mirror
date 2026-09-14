import { getInteractionId } from '../interaction-id-context/getInteractionId';
import { addCohortingCustomData } from '../interaction-metrics';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function addUFOCustomCohortData(
	key: string,
	value: number | boolean | string | null | undefined,
): void {
	const interactionId = getInteractionId();
	const currentInteractionId = interactionId.current;
	if (!currentInteractionId) {
		return;
	}

	addCohortingCustomData(currentInteractionId, key, value);
}

import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import { getInteractionId } from '../interaction-id-context';
import { addMark } from '../interaction-metrics';

export default function UFOCustomMark({ name, timestamp }: { name: string; timestamp?: number }) {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (interactionContext != null) {
			interactionContext.addMark(name, timestamp);
		}
	}, [interactionContext, name, timestamp]);
	return null;
}

export function UFOCustomMarks({ data }: { data: { [key: string]: number } | undefined }) {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (interactionContext != null && data != null) {
			Object.keys(data).forEach((i) => {
				interactionContext.addMark(i, data[i]);
			});
		}
	}, [data, interactionContext]);
	return null;
}

export function addUFOCustomMark(name: string, timestamp?: number): void {
	const interactionId = getInteractionId();
	const currentInteractionId = interactionId.current;

	if (!currentInteractionId) {
		return;
	}
	const time = timestamp || performance.now();
	addMark(currentInteractionId, 'custom', name, [], time);
}

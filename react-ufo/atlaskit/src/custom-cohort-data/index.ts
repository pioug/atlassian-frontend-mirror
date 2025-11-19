import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import { getInteractionId } from '../interaction-id-context';
import { addCohortingCustomData } from '../interaction-metrics';

import type { UFOCustomCohortDataProps } from './types';

export type { UFOCustomCohortDataProps } from './types';

export default function UFOCustomCohortData({ dataKey, value }: UFOCustomCohortDataProps) {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (!interactionContext) {
			return;
		}

		const interactionId = getInteractionId();
		const currentInteractionId = interactionId.current;
		if (!currentInteractionId) {
			return;
		}

		addCohortingCustomData(currentInteractionId, dataKey, value);
	}, [dataKey, value, interactionContext]);
	return null;
}

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

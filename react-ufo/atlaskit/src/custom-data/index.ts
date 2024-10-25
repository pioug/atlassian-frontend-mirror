import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import { getInteractionId } from '../interaction-id-context';
import { addCustomData, type CustomData } from '../interaction-metrics';

import type { UFOCustomDataProps } from './types';

export type { UFOCustomDataProps } from './types';

export default function UFOCustomData({ data }: UFOCustomDataProps) {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (!interactionContext) {
			return;
		}

		interactionContext.addCustomData(data);
	}, [data, interactionContext]);
	return null;
}

export function addUFOCustomData(data: CustomData) {
	const interactionId = getInteractionId();
	const currentInteractionId = interactionId.current;
	if (!currentInteractionId) {
		return;
	}

	addCustomData(currentInteractionId, [], data);
}

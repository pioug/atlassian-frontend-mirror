import { useContext, useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

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

		if (
			typeof globalThis?.structuredClone === 'function' &&
			fg('platform_ufo_custom_data_structured_clone')
		) {
			interactionContext.addCustomData(globalThis.structuredClone(data));
		} else {
			interactionContext.addCustomData(data);
		}
	}, [data, interactionContext]);
	return null;
}

export function addUFOCustomData(data: CustomData) {
	const interactionId = getInteractionId();
	const currentInteractionId = interactionId.current;
	if (!currentInteractionId) {
		return;
	}

	if (
		typeof globalThis?.structuredClone === 'function' &&
		fg('platform_ufo_custom_data_structured_clone')
	) {
		addCustomData(currentInteractionId, [], globalThis.structuredClone(data));
	} else {
		addCustomData(currentInteractionId, [], data);
	}
}

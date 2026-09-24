import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import type { UFOCustomDataProps } from './types';

export type { UFOCustomDataProps } from './types';

export default function UFOCustomData({ data }: UFOCustomDataProps) {
	const interactionContext = useContext(UFOInteractionContext);
	useMemo(() => {
		if (!interactionContext) {
			return;
		}

		if (typeof globalThis?.structuredClone === 'function') {
			interactionContext.addCustomData(globalThis.structuredClone(data));
		} else {
			interactionContext.addCustomData(data);
		}
	}, [data, interactionContext]);
	return null;
}

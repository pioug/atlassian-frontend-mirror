/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { useContext, useMemo } from 'react';

import UFOInteractionContext from '../interaction-context';
import { getInteractionId } from '../interaction-id-context/getInteractionId';
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

/**
 * @deprecated Use `import { addUFOCustomCohortData } from '@atlaskit/react-ufo/add-ufo-custom-cohort-data'` instead.
 */
export { addUFOCustomCohortData } from './addUFOCustomCohortData';

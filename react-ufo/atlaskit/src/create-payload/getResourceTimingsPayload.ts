import { type ResourceTiming } from '../common/react-ufo-payload-schema';
import type { ResourceTimings } from '../resource-timing';
import { compactResourceTimings } from '../resource-timing/common/utils/compact-resource-timings';
import { objectToArray } from './objectToArray';

export function getResourceTimingsPayload(resourceTimings: ResourceTimings): any {
	const legacyResourceTimings = objectToArray(resourceTimings) as ResourceTiming[];

	return compactResourceTimings(legacyResourceTimings);
}

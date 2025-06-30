import type { InteractionMetrics } from '../../../common';

import getSegmentId from './get-segment-id';

export default function hasSegmentFailed(errors: InteractionMetrics['errors'], segmentId: string) {
	return errors.some((error) => {
		if (!error.labelStack) {return false;}
		const errorSegmentId = getSegmentId(error.labelStack);
		return errorSegmentId === segmentId;
	});
}

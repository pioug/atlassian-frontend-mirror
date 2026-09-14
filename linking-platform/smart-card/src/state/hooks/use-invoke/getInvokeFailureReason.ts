import type { InvokeError } from '@atlaskit/linking-types/smart-link-actions';

import { TrackQuickActionFailureReason } from '../../../utils/analytics/analytics';
import { isInvokeCustomError } from './isInvokeCustomError';

export const getInvokeFailureReason = (
	err: InvokeError | Error,
): TrackQuickActionFailureReason.PermissionError | TrackQuickActionFailureReason.UnknownError => {
	if (!isInvokeCustomError(err)) {
		return TrackQuickActionFailureReason.UnknownError;
	}

	switch (err?.errorCode) {
		case 403:
			return TrackQuickActionFailureReason.PermissionError;
		default:
			return TrackQuickActionFailureReason.UnknownError;
	}
};

import { type InvokeError } from '@atlaskit/linking-types';

import { TrackQuickActionFailureReason } from '../../../utils/analytics/analytics';

export const getInvokeFailureReason = (err: InvokeError | Error) => {
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

export const isInvokeCustomError = (err: InvokeError | Error): err is InvokeError =>
	(err as InvokeError)?.message !== undefined && (err as InvokeError)?.errorCode !== undefined;

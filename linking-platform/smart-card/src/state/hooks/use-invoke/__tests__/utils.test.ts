import { InvokeError } from '@atlaskit/linking-types/smart-link-actions';

import { TrackQuickActionFailureReason } from '../../../../utils/analytics/analytics';
import { getInvokeFailureReason } from '../getInvokeFailureReason';
import { isInvokeCustomError } from '../isInvokeCustomError';

describe('getInvokeFailureReason', () => {
	it('returns unknown reason if error is not invoke error', () => {
		expect(getInvokeFailureReason(new Error())).toBe(TrackQuickActionFailureReason.UnknownError);
	});

	it('returns permission error if error is 403', () => {
		expect(getInvokeFailureReason(new InvokeError('You shall not passed!', 403))).toBe(
			TrackQuickActionFailureReason.PermissionError,
		);
	});

	it('returns unknown error on unhandled error code', () => {
		expect(getInvokeFailureReason(new InvokeError('Meh', 500))).toBe(
			TrackQuickActionFailureReason.UnknownError,
		);
	});
});

describe('isInvokeCustomError', () => {
	it('return true if error is an InvokeError', () => {
		expect(isInvokeCustomError(new InvokeError('Yes, yes, I am.', 500))).toBe(true);
	});

	it('return false if error is not an InvokeError', () => {
		expect(isInvokeCustomError(new Error())).toBe(false);
	});
});

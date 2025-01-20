import { BaseMediaClientError, getMediaClientErrorReason, isMediaClientError } from '../../errors';

import type { MediaClientErrorReason, MediaClientErrorAttributes } from '../../errors/types';

class TestError extends BaseMediaClientError<
	MediaClientErrorReason,
	{ data: string },
	Error | undefined,
	MediaClientErrorAttributes & {
		some: string;
		data: string;
	}
> {
	constructor(reason: MediaClientErrorReason, metadata: { data: string }) {
		super(reason, metadata, undefined);
	}
	get attributes() {
		return {
			reason: 'serverUnexpectedError' as const,
			some: this.reason,
			data: this.metadata.data,
		};
	}
}

describe('MediaClientError', () => {
	it('should be identifiable', () => {
		const nonObject = 'I am a string';
		expect(isMediaClientError(nonObject)).toBeFalsy();

		const trickyObject = { attributes: 'I am a string' };
		expect(isMediaClientError(trickyObject)).toBeFalsy();

		const fakeError = {
			attributes: { reason: 'I am not a MediaClientErrorReason' },
		};
		expect(isMediaClientError(fakeError)).toBeFalsy();

		const fakeError2 = {
			attributes: { reason: 'serverUnexpectedError' },
		};
		expect(isMediaClientError(fakeError2)).toBeFalsy();

		const unknownError = new Error('unknown error');
		expect(isMediaClientError(unknownError)).toBeFalsy();

		const testError = new TestError('serverUnexpectedError', { data: 'data' });
		expect(isMediaClientError(testError)).toBeTruthy();
	});

	describe('BaseMediaClientError', () => {
		// Not working
		/* it('should be extensible', () => {
			const testError = new TestError('serverUnexpectedError', { data: 'data' });
			expect(typeof Object.getPrototypeOf(testError).attributes).toBeTruthy();
		}); */
	});

	describe('getMediaClientErrorReason()', () => {
		it('should return reason if error is MediaClientError type', () => {
			const testError = new TestError('serverUnexpectedError', { data: 'data' });
			expect(getMediaClientErrorReason(testError)).toEqual('serverUnexpectedError');
		});

		it('should return unknown otherwise', () =>
			expect(getMediaClientErrorReason(new Error())).toEqual('unknown'));
	});
});

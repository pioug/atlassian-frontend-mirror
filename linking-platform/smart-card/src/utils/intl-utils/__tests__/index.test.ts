import { messages } from '../../../messages';
import { toMessage } from '../index';

describe('toMessageDescriptor', () => {
	it('returns message descriptor', () => {
		expect(toMessage(messages.request_access_pending_title, 'request_access')).toEqual(
			messages.request_access,
		);
	});

	it('return default message descriptor when key is undefined', () => {
		expect(toMessage(messages.request_access_pending_title, undefined)).toEqual(
			messages.request_access_pending_title,
		);
	});

	it('return default message descriptor when key is invalid', () => {
		expect(
			// @ts-ignore Ignore for test purpose
			toMessage(messages.request_access_pending_title, true),
		).toEqual(messages.request_access_pending_title);
	});
});

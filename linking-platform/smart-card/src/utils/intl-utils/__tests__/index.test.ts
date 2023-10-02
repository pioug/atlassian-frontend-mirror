import { messages } from '../../../messages';
import { toMessage } from '../index';

describe('toMessageDescriptor', () => {
  it('returns message descriptor', () => {
    expect(
      toMessage(
        messages.request_access_pending_title_crossjoin,
        'request_access_crossjoin',
      ),
    ).toEqual(messages.request_access_crossjoin);
  });

  it('return default message descriptor when key is undefined', () => {
    expect(
      toMessage(messages.request_access_pending_title_crossjoin, undefined),
    ).toEqual(messages.request_access_pending_title_crossjoin);
  });

  it('return default message descriptor when key is invalid', () => {
    expect(
      // @ts-ignore Ignore for test purpose
      toMessage(messages.request_access_pending_title_crossjoin, true),
    ).toEqual(messages.request_access_pending_title_crossjoin);
  });
});

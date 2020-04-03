import { fireSmartLinkEvent, ANALYTICS_CHANNEL } from '../analytics';
import { AnalyticsPayload } from '../types';

// Mock our fire analytics function
describe('fireSmartLinkEvent', () => {
  test('Fires an analytics event when given a valid gas payload and a valid create analytics event function', () => {
    const payload: AnalyticsPayload = {
      action: 'clicked',
      actionSubject: 'smartLink',
      eventType: 'ui',
      attributes: {},
    };

    const mockedFireFn = jest.fn();
    const fakeCreateAnalyticsEvent = jest
      .fn()
      .mockImplementation(() => ({ fire: mockedFireFn, payload }));

    fireSmartLinkEvent(payload, fakeCreateAnalyticsEvent);

    expect(mockedFireFn).toBeCalledWith(ANALYTICS_CHANNEL);
    expect(fakeCreateAnalyticsEvent).toBeCalled();
    expect(fakeCreateAnalyticsEvent).toBeCalledWith(payload);
  });
});

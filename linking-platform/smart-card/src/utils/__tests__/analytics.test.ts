import { ANALYTICS_CHANNEL, fireSmartLinkEvent } from '../analytics';
import { type AnalyticsPayload } from '../types';

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

		expect(mockedFireFn).toHaveBeenCalledWith(ANALYTICS_CHANNEL);
		expect(fakeCreateAnalyticsEvent).toHaveBeenCalled();
		expect(fakeCreateAnalyticsEvent).toHaveBeenCalledWith(payload);
	});
});

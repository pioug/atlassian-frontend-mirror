import { ANALYTICS_CHANNEL, fireSmartLinkEvent, uiActionClickedEvent } from '../analytics';
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

describe('uiActionClickedEvent', () => {
	it.each([
		['DownloadAction', 'downloadDocument'],
		['PreviewAction', 'invokePreviewScreen'],
		['ViewAction', 'shortcutGoToLink'],
		['ServerAction', undefined],
	])(
		'returns action button click event for action type %s',
		(actionType: string, actionSubjectId: string | undefined) => {
			const event = uiActionClickedEvent({
				id: 'id',
				actionType,
				extensionKey: 'extension-key',
				display: 'block',
			});

			expect(event).toEqual({
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId: actionSubjectId,
				attributes: {
					actionType: actionType,
					componentName: 'smart-cards',
					display: 'block',
					id: 'id',
					extensionKey: 'extension-key',
					packageName: expect.any(String),
					packageVersion: expect.any(String),
				},
				eventType: 'ui',
			});
		},
	);
});

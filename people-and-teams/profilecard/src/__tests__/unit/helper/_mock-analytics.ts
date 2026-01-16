import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';

export const createAnalyticsEvent: jest.Mock<any, [body: any], any> = jest.fn((body) => {
	// Mocking an implementation of this so tests will run successfully
	const event = {
		dummy: 'hello',
		clone: () => ({
			fire: () => undefined,
		}),
	};

	return event as any;
});

export function flexiTime(event: AnalyticsEventPayload): AnalyticsEventPayload {
	return {
		...event,
		attributes: {
			...event.attributes,
			firedAt: expect.anything(),
		},
	};
}

import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { fireOperationalEvent } from '../../cardAnalytics';
import {
	type FileAttributes,
	ANALYTICS_MEDIA_CHANNEL,
	type PerformanceAttributes,
	type MediaTraceContext,
} from '@atlaskit/media-common';
import * as analyticsModule from '../../../utils/analytics/analytics';
import type { SSRStatus } from '../../../utils/analytics/analytics';

const getRenderErrorEventPayload = jest.spyOn(analyticsModule, 'getRenderErrorEventPayload');

const event = { fire: jest.fn() };
const createAnalyticsEventMock = jest.fn(() => event);
const createAnalyticsEvent = createAnalyticsEventMock as unknown as CreateUIAnalyticsEvent;
const fileAttributes = {
	fileId: '264d2928-44b6-4565-ab73-9d90c96b763d',
	some: 'file attributes',
} as unknown as FileAttributes;
const performanceAttributes = {
	some: 'performance attributes',
} as unknown as PerformanceAttributes;
const ssrReliability: SSRStatus = {
	server: { status: 'success' },
	client: { status: 'success' },
};
const traceContext: MediaTraceContext = {
	traceId: 'some-trace-Id',
	spanId: 'some-span-Id',
};

const metadataTraceContext: MediaTraceContext = {
	traceId: 'some-trace-Id',
	spanId: 'some-span-Id',
};

describe('fireOperationalEvent', () => {
	beforeEach(() => {
		event.fire.mockClear();
		createAnalyticsEventMock.mockClear();
	});

	it('should fire failed event if status is error with a default Error if the error was not provided', () => {
		fireOperationalEvent(
			createAnalyticsEvent,
			'error',
			fileAttributes,
			performanceAttributes,
			ssrReliability,
			undefined,
			traceContext,
			metadataTraceContext,
		);

		expect(getRenderErrorEventPayload).toBeCalledWith(
			fileAttributes,
			performanceAttributes,
			expect.any(Error),
			ssrReliability,
			traceContext,
			metadataTraceContext,
		);
		expect(createAnalyticsEventMock).toBeCalledWith({
			action: 'failed',
			actionSubject: 'mediaCardRender',
			attributes: {
				error: 'nativeError',
				errorDetail: 'missing-error-data',
				failReason: 'missing-error-data',
				fileAttributes: {
					fileId: '264d2928-44b6-4565-ab73-9d90c96b763d',
					some: 'file attributes',
				},
				metadataTraceContext: {
					spanId: 'some-span-Id',
					traceId: 'some-trace-Id',
				},
				performanceAttributes: { some: 'performance attributes' },
				request: undefined,
				ssrReliability: {
					client: { status: 'success' },
					server: { status: 'success' },
				},
				status: 'fail',
				traceContext: { spanId: 'some-span-Id', traceId: 'some-trace-Id' },
			},
			eventType: 'operational',
		});
		expect(event.fire).toBeCalledTimes(1);
		expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
	});
});

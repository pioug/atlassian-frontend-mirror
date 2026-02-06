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
import { createRateLimitedError } from '@atlaskit/media-client/test-helpers';
import { MediaCardError } from '../../../errors';

const getRenderErrorEventPayload = jest.spyOn(analyticsModule, 'getRenderErrorEventPayload');
const getRenderFailedFileStatusPayload = jest.spyOn(
	analyticsModule,
	'getRenderFailedFileStatusPayload',
);

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
		jest.clearAllMocks();
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
				statusCode: undefined,
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

	it('should fire failed event with request metadata and statusCode when error has RequestError as secondaryError', () => {
		const requestError = createRateLimitedError({
			method: 'GET',
			endpoint: '/file/{fileId}',
			mediaRegion: 'ap-southeast-2',
			mediaEnv: 'adev',
		});
		const error = new MediaCardError('metadata-fetch', requestError);

		fireOperationalEvent(
			createAnalyticsEvent,
			'error',
			fileAttributes,
			performanceAttributes,
			ssrReliability,
			error,
			traceContext,
			metadataTraceContext,
		);

		expect(getRenderErrorEventPayload).toBeCalledWith(
			fileAttributes,
			performanceAttributes,
			error,
			ssrReliability,
			traceContext,
			metadataTraceContext,
		);
		expect(createAnalyticsEventMock).toBeCalledWith({
			action: 'failed',
			actionSubject: 'mediaCardRender',
			attributes: {
				error: 'serverRateLimited',
				errorDetail: 'serverRateLimited',
				failReason: 'metadata-fetch',
				fileAttributes: {
					fileId: '264d2928-44b6-4565-ab73-9d90c96b763d',
					some: 'file attributes',
				},
				fileMimetype: undefined,
				metadataTraceContext: {
					spanId: 'some-span-Id',
					traceId: 'some-trace-Id',
				},
				performanceAttributes: { some: 'performance attributes' },
				statusCode: 429,
				request: {
					method: 'GET',
					endpoint: '/file/{fileId}',
					mediaRegion: 'ap-southeast-2',
					mediaEnv: 'adev',
					statusCode: 429,
				},
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

	it('should fire failed event for failed-processing status with processingFailReason', () => {
		fireOperationalEvent(
			createAnalyticsEvent,
			'failed-processing',
			fileAttributes,
			performanceAttributes,
			ssrReliability,
			undefined,
			traceContext,
			metadataTraceContext,
			'timeout',
		);

		expect(getRenderFailedFileStatusPayload).toBeCalledWith(
			fileAttributes,
			performanceAttributes,
			ssrReliability,
			traceContext,
			metadataTraceContext,
			'timeout',
		);
		expect(event.fire).toBeCalledTimes(1);
		expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
	});

	it('should fire failed event for failed-processing status with undefined processingFailReason and default to not-available', () => {
		fireOperationalEvent(
			createAnalyticsEvent,
			'failed-processing',
			fileAttributes,
			performanceAttributes,
			ssrReliability,
			undefined,
			traceContext,
			metadataTraceContext,
			undefined,
		);

		expect(getRenderFailedFileStatusPayload).toBeCalledWith(
			fileAttributes,
			performanceAttributes,
			ssrReliability,
			traceContext,
			metadataTraceContext,
			undefined,
		);
		// Verify the payload includes 'not-available' as fallback
		const payload = getRenderFailedFileStatusPayload.mock.results[0].value;
		expect(payload.attributes.processingFailReason).toBe('not-available');
		expect(event.fire).toBeCalledTimes(1);
		expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
	});
});

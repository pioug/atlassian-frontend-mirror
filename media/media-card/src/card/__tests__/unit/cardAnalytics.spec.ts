import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { fireOperationalEvent, fireCopiedEvent } from '../../cardAnalytics';
import {
	type FileAttributes,
	ANALYTICS_MEDIA_CHANNEL,
	type PerformanceAttributes,
	type MediaTraceContext,
} from '@atlaskit/media-common';
import * as analyticsModule from '../../../utils/analytics/analytics';
import type { SSRStatus } from '../../../utils/analytics/analytics';

const getRenderErrorEventPayload = jest.spyOn(analyticsModule, 'getRenderErrorEventPayload');
const getCopiedFilePayload = jest.spyOn(analyticsModule, 'getCopiedFilePayload');

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

describe('fireCopiedEvent', () => {
	const cardRef = document.createElement('div');
	const fileId = 'some-file-id';

	beforeEach(() => {
		event.fire.mockClear();
		createAnalyticsEventMock.mockClear();
	});

	it('should fire copied event if the div element is inside a selection', () => {
		window.getSelection = jest.fn().mockReturnValue({
			containsNode: () => true,
		});

		fireCopiedEvent(createAnalyticsEvent, fileId, cardRef);

		expect(getCopiedFilePayload).toBeCalledWith(fileId);
		expect(createAnalyticsEventMock).toBeCalledWith({
			action: 'copied',
			actionSubject: 'file',
			actionSubjectId: 'some-file-id',
			attributes: {},
			eventType: 'ui',
		});
		expect(event.fire).toBeCalledTimes(1);
		expect(event.fire).toBeCalledWith(ANALYTICS_MEDIA_CHANNEL);
	});

	it('should not fire copied event if selection api is not available', () => {
		window.getSelection = jest.fn().mockReturnValue({});

		fireCopiedEvent(createAnalyticsEvent, fileId, cardRef);
		expect(event.fire).toBeCalledTimes(0);
	});

	it('should not fire copied event if the div element is not inside a selection', () => {
		window.getSelection = jest.fn().mockReturnValue({
			containsNode: () => false,
		});

		fireCopiedEvent(createAnalyticsEvent, fileId, cardRef);
		expect(event.fire).toBeCalledTimes(0);
	});
});

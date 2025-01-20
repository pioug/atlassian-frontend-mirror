jest.mock('@atlaskit/analytics-next', () => {
	const actualModule = jest.requireActual('@atlaskit/analytics-next');
	return {
		__esModule: true,
		...actualModule,
		createAndFireEvent: jest.fn(actualModule.createAndFireEvent),
	};
});

import React from 'react';
import { mount } from 'enzyme';
import {
	AnalyticsListener,
	withAnalyticsEvents,
	type CreateUIAnalyticsEvent,
	type UIAnalyticsEvent,
	createAndFireEvent,
} from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
	createAndFireMediaCardEvent,
	fireMediaCardEvent,
	type MediaCardAnalyticsEventPayload,
	getRenderErrorFailReason,
	getRenderErrorErrorReason,
	getRenderErrorErrorDetail,
	getRenderErrorRequestMetadata,
	getRenderErrorEventPayload,
	getRenderPreviewableCardPayload,
	extractErrorInfo,
	type SSRStatus,
} from './analytics';
import {
	type FileAttributes,
	type MediaTraceContext,
	type PerformanceAttributes,
} from '@atlaskit/media-common';
import { createMediaStoreError, createRateLimitedError } from '@atlaskit/media-client/test-helpers';
import { getMediaClientErrorReason } from '@atlaskit/media-client';
import { MediaCardError } from '../../errors';

const somePayload: MediaCardAnalyticsEventPayload = {
	eventType: 'ui',
	action: 'clicked',
	actionSubject: 'the-subject',
	actionSubjectId: 'the-subject-id',
	attributes: {
		label: 'somelabel',
	},
};

const mediaPayload: MediaCardAnalyticsEventPayload = {
	...somePayload,
	attributes: {
		...somePayload.attributes,
	},
};

describe('Media Analytics', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should provide an analytics event creator for Media Card', () => {
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		const SomeComponent = ({ onClick }: any) => <span onClick={onClick}>Hi!</span>;
		const SomeWrappedComponent = withAnalyticsEvents({
			onClick: createAndFireMediaCardEvent(somePayload),
		})(SomeComponent);

		const analyticsEventHandler = jest.fn();
		const listener = mount(
			<AnalyticsListener channel={FabricChannel.media} onEvent={analyticsEventHandler}>
				<SomeWrappedComponent />
			</AnalyticsListener>,
		);
		listener.find(SomeComponent).simulate('click');

		expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
		const actualEvent: Partial<UIAnalyticsEvent> = analyticsEventHandler.mock.calls[0][0];
		expect(actualEvent.payload).toMatchObject(mediaPayload);
	});

	it('Should provide an analytics event trigger for Media Card', () => {
		type SomeComponentProps = {
			createAnalyticsEvent: CreateUIAnalyticsEvent;
		};
		const SomeComponent = (props: SomeComponentProps) => {
			const onCustomEvent = () => {
				fireMediaCardEvent(somePayload, props.createAnalyticsEvent);
			};
			onCustomEvent();
			// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
			return <span>'Hi!'</span>;
		};
		const SomeWrappedComponent = withAnalyticsEvents()(SomeComponent);

		const analyticsEventHandler = jest.fn();
		mount(
			<AnalyticsListener channel={FabricChannel.media} onEvent={analyticsEventHandler}>
				<SomeWrappedComponent />
			</AnalyticsListener>,
		);

		expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
		const actualEvent: Partial<UIAnalyticsEvent> = analyticsEventHandler.mock.calls[0][0];
		expect(actualEvent.payload).toMatchObject(mediaPayload);
	});

	describe('getRenderErrorEventPayload', () => {
		const fileAttributes: FileAttributes = {
			fileId: 'some-id',
			fileSize: 10,
			fileMediatype: 'image',
			fileMimetype: 'image/png',
			fileStatus: 'processed',
		};
		const performanceAttributes: PerformanceAttributes = {
			overall: {
				durationSinceCommenced: 100,
				durationSincePageStart: 1000,
			},
		};
		it('should attach FailedSubscriptionFailReason to failReason and MediaClientErrorReason to error', () => {
			const error = new MediaCardError('metadata-fetch', createRateLimitedError());
			const traceContext: MediaTraceContext = { traceId: 'some-trace-id' };
			const ssrReliability: SSRStatus = {
				server: { status: 'unknown' },
				client: { status: 'unknown' },
			};
			expect(
				getRenderErrorEventPayload(
					fileAttributes,
					performanceAttributes,
					error,
					ssrReliability,
					traceContext,
				),
			).toMatchObject({
				eventType: 'operational',
				action: 'failed',
				actionSubject: 'mediaCardRender',
				attributes: {
					fileAttributes,
					performanceAttributes,
					status: 'fail',
					failReason: 'metadata-fetch',
					error: getRenderErrorErrorReason(error),
					errorDetail: getRenderErrorErrorDetail(error),
					request: getRenderErrorRequestMetadata(error),
					traceContext,
				},
			});
		});
	});

	describe('getRenderPreviewableCardPayload', () => {
		const fileAttributes: FileAttributes = {
			fileId: 'some-id',
			fileSize: 10,
			fileMediatype: 'video',
			fileMimetype: 'video/webm',
			fileStatus: 'processed',
		};

		it('should be a screen event returning mediaCardRenderScreen as the actionSubject and name', () => {
			expect(getRenderPreviewableCardPayload(fileAttributes)).toMatchObject({
				eventType: 'screen',
				action: 'viewed',
				actionSubject: 'mediaCardRenderScreen',
				name: 'mediaCardRenderScreen',
				attributes: { fileAttributes },
			});
		});
	});

	describe('Helpers', () => {
		it('getRenderFailedPreviewFetchFailReason should return media card error primary reason', () => {
			const error = new MediaCardError('local-preview-get', new Error('some-error'));
			expect(getRenderErrorFailReason(error)).toBe(error.primaryReason);
		});

		it('getRenderErrorErrorReason should return MediaClientErrorReason or nativeError', () => {
			const someMediaClientError = createRateLimitedError();
			expect(
				getRenderErrorErrorReason(new MediaCardError('preview-fetch', someMediaClientError)),
			).toBe(getMediaClientErrorReason(someMediaClientError));

			expect(
				getRenderErrorErrorReason(new MediaCardError('preview-fetch', new Error('some-error'))),
			).toBe('nativeError');
		});

		it('getRenderErrorErrorDetail should return secondary error message', () => {
			const someMediaClientError = createRateLimitedError();
			expect(
				getRenderErrorErrorDetail(new MediaCardError('preview-fetch', someMediaClientError)),
			).toBe(someMediaClientError.message);

			expect(
				getRenderErrorErrorDetail(
					new MediaCardError('preview-fetch', new Error('some-error-message')),
				),
			).toBe('some-error-message');
		});

		it('getRenderErrorRequestMetadata should return request metadata', () => {
			const someMediaClientError = createRateLimitedError({
				method: 'POST',
				endpoint: '/some-endpoint',
				mediaRegion: 'some-region',
				mediaEnv: 'some-env',
			});

			expect(
				getRenderErrorRequestMetadata(new MediaCardError('preview-fetch', someMediaClientError)),
			).toStrictEqual({
				method: 'POST',
				endpoint: '/some-endpoint',
				mediaRegion: 'some-region',
				mediaEnv: 'some-env',
				statusCode: 429,
			});
		});

		it('extractErrorInfo should return failReason, secondaryError and secondaryError detail', () => {
			expect(
				extractErrorInfo(new MediaCardError('ssr-server-uri', createMediaStoreError())),
			).toStrictEqual({
				failReason: 'ssr-server-uri',
				error: 'missingInitialAuth',
				errorDetail: 'missingInitialAuth',
				metadataTraceContext: undefined,
			});
		});

		it('extractErrorInfo should return failReason, secondaryError and secondaryError detail, metadataTraceContext when metadataTraceContext is provided via param', () => {
			expect(
				extractErrorInfo(new MediaCardError('ssr-server-uri', createMediaStoreError()), {
					traceId: 'test-id',
				}),
			).toStrictEqual({
				failReason: 'ssr-server-uri',
				error: 'missingInitialAuth',
				errorDetail: 'missingInitialAuth',
				metadataTraceContext: {
					traceId: 'test-id',
				},
			});
		});

		it('extractErrorInfo should return failReason, secondaryError and secondaryError detail, metadataTraceContext when metadataTraceContext is provided via Error', () => {
			const rateLimitedError = createRateLimitedError({
				traceContext: {
					traceId: 'test-id',
				},
			});
			const error = new MediaCardError('ssr-server-uri', rateLimitedError);

			expect(extractErrorInfo(error)).toStrictEqual({
				failReason: 'ssr-server-uri',
				error: 'serverRateLimited',
				errorDetail: 'serverRateLimited',
				metadataTraceContext: {
					traceId: 'test-id',
				},
			});
		});
	});

	describe('Sanitisation', () => {
		describe('fireMediaCardEvent', () => {
			it('should sanitise the file id', () => {
				const createAnalyticsEvent = jest.fn(() => ({ fire: jest.fn() }));
				const payload = {
					attributes: {
						fileAttributes: { fileId: 'this is an invalid file id' },
					},
				};

				fireMediaCardEvent(payload as any, createAnalyticsEvent as any);

				expect(createAnalyticsEvent).toHaveBeenCalledWith({
					attributes: { fileAttributes: { fileId: 'INVALID_FILE_ID' } },
				});
			});

			it('should preserve a valid file id', () => {
				const createAnalyticsEvent = jest.fn(() => ({ fire: jest.fn() }));
				const validFileId = 'c2c581e3-8fb7-44ef-b3ed-7c9c9a29c3ef';
				const payload = {
					attributes: { fileAttributes: { fileId: validFileId } },
				};

				fireMediaCardEvent(payload as any, createAnalyticsEvent as any);

				expect(createAnalyticsEvent).toHaveBeenCalledWith({
					attributes: { fileAttributes: { fileId: validFileId } },
				});
			});
		});

		describe('createAndFireMediaCardEvent', () => {
			it('should sanitise the file id', () => {
				const createdEvent = jest.fn();
				(createAndFireEvent as jest.Mock).mockReturnValueOnce(createdEvent);
				const payload = {
					attributes: {
						fileAttributes: { fileId: 'this is an invalid file id' },
					},
				};

				createAndFireMediaCardEvent(payload as any);

				expect(createdEvent).toHaveBeenCalledWith({
					attributes: { fileAttributes: { fileId: 'INVALID_FILE_ID' } },
				});
			});

			it('should preserve a valid file id', () => {
				const createdEvent = jest.fn();
				(createAndFireEvent as jest.Mock).mockReturnValueOnce(createdEvent);
				const validFileId = 'c2c581e3-8fb7-44ef-b3ed-7c9c9a29c3ef';
				const payload = {
					attributes: { fileAttributes: { fileId: validFileId } },
				};

				createAndFireMediaCardEvent(payload as any);

				expect(createdEvent).toHaveBeenCalledWith({
					attributes: { fileAttributes: { fileId: validFileId } },
				});
			});
		});
	});
});

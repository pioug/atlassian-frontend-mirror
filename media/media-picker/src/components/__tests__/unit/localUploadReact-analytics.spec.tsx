import { RequestError } from '@atlaskit/media-client';
import { LocalUploadComponentReact } from '../../localUploadReact';
import { type UploadErrorEventPayload } from '../../../types';
import { failMediaUploadUfoExperience } from '../../../util/ufoExperiences';

// Mock the feature flag
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(() => false),
}));

// Mock the UFO experience
jest.mock('../../../util/ufoExperiences', () => ({
	startMediaUploadUfoExperience: jest.fn(),
	succeedMediaUploadUfoExperience: jest.fn(),
	failMediaUploadUfoExperience: jest.fn(),
}));

// Mock performance marks
jest.mock('perf-marks', () => ({
	start: jest.fn(),
	end: jest.fn(() => ({ duration: 1000 })),
}));

describe('LocalUploadComponentReact - fireUploadFailed analytics', () => {
	let mockCreateAnalyticsEvent: jest.Mock;
	let mockFireEvent: jest.Mock;
	let component: LocalUploadComponentReact<any>;

	beforeEach(() => {
		mockFireEvent = jest.fn();
		mockCreateAnalyticsEvent = jest.fn(() => ({
			fire: mockFireEvent,
		}));

		const props = {
			mediaClient: {} as any,
			config: {} as any,
			createAnalyticsEvent: mockCreateAnalyticsEvent,
		};

		component = new LocalUploadComponentReact(props, 'browser');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('statusCode field in analytics event', () => {
		it('should include statusCode at top level when error has RequestError with statusCode', async () => {
			const requestError = new RequestError('serverRateLimited', {
				method: 'POST',
				endpoint: '/upload',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 429,
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-123',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Server rate limited',
				},
				traceContext: {
					traceId: 'trace-123',
					spanId: 'span-123',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBe(429);
			expect(eventPayload.attributes.request?.statusCode).toBe(429);
			expect(eventPayload.attributes.request?.method).toBe('POST');
			expect(eventPayload.attributes.request?.endpoint).toBe('/upload');
		});

		it('should include statusCode 401 when error has unauthorized RequestError', async () => {
			const requestError = new RequestError('serverUnauthorized', {
				method: 'GET',
				endpoint: '/file/{fileId}',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 401,
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-456',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Unauthorized',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBe(401);
			expect(eventPayload.attributes.request?.statusCode).toBe(401);
		});

		it('should include statusCode 403 when error has forbidden RequestError', async () => {
			const requestError = new RequestError('serverForbidden', {
				method: 'GET',
				endpoint: '/file/{fileId}',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 403,
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-789',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Forbidden',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBe(403);
			expect(eventPayload.attributes.request?.statusCode).toBe(403);
		});

		it('should include statusCode 500 when error has internal server error RequestError', async () => {
			const requestError = new RequestError('serverInternalError', {
				method: 'POST',
				endpoint: '/upload',
				mediaRegion: 'us-west-2',
				mediaEnv: 'prod',
				statusCode: 500,
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-999',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Internal server error',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBe(500);
			expect(eventPayload.attributes.request?.statusCode).toBe(500);
		});

		it('should have undefined statusCode when error is not a RequestError', async () => {
			const nativeError = new Error('Network timeout');

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-timeout',
				error: {
					name: 'upload_fail',
					rawError: nativeError,
					description: 'Network timeout',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBeUndefined();
			expect(eventPayload.attributes.request).toBeUndefined();
		});

		it('should have undefined statusCode when rawError is null', async () => {
			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-null-error',
				error: {
					name: 'upload_fail',
					rawError: null as any,
					description: 'Unknown error',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBeUndefined();
			expect(eventPayload.attributes.request).toBeUndefined();
		});

		it('should have undefined statusCode when rawError is undefined', async () => {
			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-undefined-error',
				error: {
					name: 'upload_fail',
					rawError: undefined as any,
					description: 'Undefined error',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.attributes.statusCode).toBeUndefined();
			expect(eventPayload.attributes.request).toBeUndefined();
		});
	});

	describe('UFO experience statusCode field', () => {
		it('should include statusCode in UFO failure payload when error has RequestError', async () => {
			const requestError = new RequestError('serverRateLimited', {
				method: 'POST',
				endpoint: '/upload',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 429,
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-ufo-429',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Upload fail',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(failMediaUploadUfoExperience).toHaveBeenCalledTimes(1);
			const ufoPayload = (failMediaUploadUfoExperience as jest.Mock).mock.calls[0][1];

			expect(ufoPayload.statusCode).toBe(429);
			expect(ufoPayload.request?.statusCode).toBe(429);
		});

		it('should have undefined statusCode in UFO failure payload when error is not RequestError', async () => {
			const nativeError = new Error('Network timeout');

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-ufo-timeout',
				error: {
					name: 'upload_fail',
					description: 'Network timeout',
					rawError: nativeError,
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(failMediaUploadUfoExperience).toHaveBeenCalledTimes(1);
			const ufoPayload = (failMediaUploadUfoExperience as jest.Mock).mock.calls[0][1];

			expect(ufoPayload.statusCode).toBeUndefined();
			expect(ufoPayload.request).toBeUndefined();
		});

		it('should pass request metadata with all fields to UFO experience', async () => {
			const requestError = new RequestError('serverRateLimited', {
				method: 'POST',
				endpoint: '/upload',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 429,
				traceContext: {
					traceId: 'trace-456',
					spanId: 'span-456',
				},
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-ufo-full',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Upload fail',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(failMediaUploadUfoExperience).toHaveBeenCalledTimes(1);
			const ufoPayload = (failMediaUploadUfoExperience as jest.Mock).mock.calls[0][1];

			expect(ufoPayload.request).toEqual({
				method: 'POST',
				endpoint: '/upload',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 429,
				traceContext: {
					traceId: 'trace-456',
					spanId: 'span-456',
				},
			});
		});
	});

	describe('event structure', () => {
		it('should include all expected fields in analytics event payload', async () => {
			const requestError = new RequestError('serverRateLimited', {
				method: 'POST',
				endpoint: '/upload',
				mediaRegion: 'ap-southeast-2',
				mediaEnv: 'prod',
				statusCode: 429,
			});

			const errorPayload: UploadErrorEventPayload = {
				fileId: 'file-123',
				error: {
					name: 'upload_fail',
					rawError: requestError,
					description: 'Upload fail',
				},
				traceContext: {
					traceId: 'trace-123',
					spanId: 'span-123',
				},
			};

			await (component as any).fireUploadFailed(errorPayload);

			expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
			const eventPayload = mockCreateAnalyticsEvent.mock.calls[0][0];

			expect(eventPayload.eventType).toBe('operational');
			expect(eventPayload.action).toBe('failed');
			expect(eventPayload.actionSubject).toBe('mediaUpload');
			expect(eventPayload.actionSubjectId).toBe('localMedia');
			expect(eventPayload.attributes.status).toBe('fail');
			expect(eventPayload.attributes.failReason).toBe('upload_fail');
			expect(eventPayload.attributes.sourceType).toBe('local');
			expect(eventPayload.attributes.serviceName).toBe('upload');
			expect(eventPayload.attributes.fileAttributes).toEqual({
				fileId: 'file-123',
			});
			expect(eventPayload.attributes.traceContext).toEqual({
				traceId: 'trace-123',
				spanId: 'span-123',
			});
		});
	});
});

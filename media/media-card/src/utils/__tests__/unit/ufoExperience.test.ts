jest.mock('@atlaskit/media-common/mediaFeatureFlags', () => {
	const actualUfo = jest.requireActual('@atlaskit/media-common/mediaFeatureFlags');
	return {
		...actualUfo,
		getFeatureFlagKeysAllProducts: () => ['feature-flag-1', 'feature-flag-2'],
	};
});
const mockMediaEnvironment = 'test-local';
const mockMediaRegion = 'test-local-region';

jest.mock('@atlaskit/ufo', () => {
	const actualUfo = jest.requireActual('@atlaskit/ufo');
	return {
		...actualUfo,
		ConcurrentExperience: jest.fn(),
	};
});

jest.mock('@atlaskit/media-client', () => {
	const mediaClient = jest.requireActual('@atlaskit/media-client');
	return {
		...mediaClient,
		getMediaEnvironment: () => mockMediaEnvironment,
		getMediaRegion: () => mockMediaRegion,
	};
});

jest.mock('@atlaskit/react-ufo/interaction-metrics', () => ({
	getActiveInteraction: jest.fn().mockReturnValue({ start: 0 }),
}));

jest.mock('../../../utils/analytics', () => {
	const actualAnalytics = jest.requireActual('../../../utils/analytics');
	return {
		...actualAnalytics,
		getRenderErrorRequestMetadata: jest.fn().mockImplementation(() => undefined),
		extractErrorInfo: jest.fn().mockImplementation(() => {
			return {
				failReason: 'some-reason',
				error: 'some-error',
				errorDetail: 'some-description',
			};
		}),
	};
});

import { ConcurrentExperience } from '@atlaskit/ufo';

import {
	startUfoExperience,
	completeUfoExperience,
	abortUfoExperience,
} from '../../../utils/ufoExperiences';
import { extractErrorInfo } from '../../../utils/analytics';
import { MediaCardError } from '../../../errors';
import { type SSRStatus } from '../../../utils/analytics';

describe('ufoExperience', () => {
	const mockStart = jest.fn();
	const mockAddMetadata = jest.fn();
	const mockSuccess = jest.fn();
	const mockFailure = jest.fn();
	const mockAbort = jest.fn();
	const mockMark = jest.fn();

	const mockGetInstance = jest.fn().mockImplementation(() => {
		return {
			start: mockStart,
			success: mockSuccess,
			failure: mockFailure,
			abort: mockAbort,
			addMetadata: mockAddMetadata,
			mark: mockMark,
		} as any;
	});

	const mockConcurrentExperienceConstructor = jest.fn(() => {
		return {
			getInstance: mockGetInstance,
		} as any;
	});

	(ConcurrentExperience as jest.MockedClass<typeof ConcurrentExperience>).mockImplementation(
		mockConcurrentExperienceConstructor,
	);

	const ssrReliability: SSRStatus = {
		server: {
			status: 'success',
		},
		client: {
			status: 'success',
		},
	};
	const fileAttributes = {
		fileId: '4c9e0226-6792-4a04-85a2-ebf89b6bb079',
		fileMediatype: undefined,
		fileMimetype: undefined,
	};
	const id = 'some-id';

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('startUfoExperience', () => {
		it('should start UFO experience with an id', () => {
			startUfoExperience(id);

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('some-id');
			expect(mockStart).toHaveBeenCalledTimes(1);
			expect(mockConcurrentExperienceConstructor).toBeCalledWith('media-card-render', {
				featureFlags: ['feature-flag-1', 'feature-flag-2'],
				platform: { component: 'media-card' },
				type: 'experience',
				performanceType: 'inline-result',
			});
		});
	});

	describe('abortUfoExperience', () => {
		it('should abort UFO experience with an id', () => {
			abortUfoExperience(id);

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('some-id');
			expect(mockAbort).toHaveBeenCalledTimes(1);
		});

		it('should sanitise UGC from fileAttributes', () => {
			const fileAttributesWithUGC = {
				fileId: 'some-id?someemail@gmail.com',
				fileMediatype: undefined,
				fileMimetype: undefined,
			};
			abortUfoExperience(id, { fileAttributes: fileAttributesWithUGC });

			expect(mockAbort).toBeCalledWith({
				metadata: expect.objectContaining({ fileAttributes: { fileId: 'INVALID_FILE_ID' } }),
			});
		});
	});

	describe('completeUfoExperience', () => {
		it('should succeed an experience when the status is complete', () => {
			completeUfoExperience(
				id,
				'complete',
				fileAttributes,
				{ wasStatusUploading: true, wasStatusProcessing: true },
				ssrReliability,
				undefined,
			);

			expect(mockSuccess).toBeCalledWith({
				metadata: {
					fileAttributes,
					ssrReliability,
					fileStateFlags: {
						wasStatusProcessing: true,
						wasStatusUploading: true,
					},
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					mediaEnvironment: mockMediaEnvironment,
					mediaRegion: mockMediaRegion,
				},
			});
		});

		it('should fail an experience when the status is failed-processing', () => {
			completeUfoExperience(
				id,
				'failed-processing',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
				undefined,
			);

			expect(mockFailure).toBeCalledWith({
				metadata: {
					fileAttributes,
					ssrReliability,
					fileStateFlags: {
						wasStatusProcessing: false,
						wasStatusUploading: false,
					},
					failReason: 'failed-processing',
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					mediaEnvironment: mockMediaEnvironment,
					mediaRegion: mockMediaRegion,
				},
			});
		});

		it('should fail an experience with a default error if the status is error but no error is provided', () => {
			completeUfoExperience(
				id,
				'error',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
			);

			expect(extractErrorInfo).toBeCalledWith(expect.any(Error));
			expect(mockFailure).toBeCalledWith({
				metadata: {
					fileAttributes,
					ssrReliability,
					fileStateFlags: {
						wasStatusProcessing: false,
						wasStatusUploading: false,
					},
					request: undefined,
					failReason: 'some-reason',
					error: 'some-error',
					errorDetail: 'some-description',
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					mediaEnvironment: mockMediaEnvironment,
					mediaRegion: mockMediaRegion,
				},
			});
		});

		it('should fail an experience with provided error data if the status is error', () => {
			const error = new MediaCardError('upload');
			completeUfoExperience(
				id,
				'error',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
				error,
			);

			expect(extractErrorInfo).toBeCalledWith(error);
			expect(mockFailure).toBeCalledWith({
				metadata: {
					fileAttributes,
					ssrReliability,
					fileStateFlags: {
						wasStatusProcessing: false,
						wasStatusUploading: false,
					},
					request: undefined,
					failReason: 'some-reason',
					error: 'some-error',
					errorDetail: 'some-description',
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					mediaEnvironment: mockMediaEnvironment,
					mediaRegion: mockMediaRegion,
				},
			});
		});

		it('should sanitise UGC from fileAttributes', () => {
			const fileAttributesWithUGC = {
				fileId: 'some-id?someemail@gmail.com',
				fileMediatype: undefined,
				fileMimetype: undefined,
			};
			completeUfoExperience(
				id,
				'complete',
				fileAttributesWithUGC,
				{ wasStatusUploading: true, wasStatusProcessing: true },
				ssrReliability,
				undefined,
			);

			expect(mockSuccess).toBeCalledWith({
				metadata: expect.objectContaining({ fileAttributes: { fileId: 'INVALID_FILE_ID' } }),
			});
		});

		it('should add SSR timing strategy metadata when SSR was successful (non-lazy)', () => {
			const ssrPreviewInfo = {
				dataUri: 'https://media.prod.atl-paas.net/file/test-file-id/image',
				wasSSRAttempted: true, // true only when SSR is non-lazy
				wasSSRSuccessful: true,
			};

			completeUfoExperience(
				id,
				'complete',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
				undefined,
				ssrPreviewInfo,
			);

			// Should add timing strategy metadata
			expect(mockAddMetadata).toHaveBeenCalled();
		});

		it('should add SSR failed timing strategy when SSR was attempted (non-lazy) but failed', () => {
			const ssrPreviewInfo = {
				dataUri: undefined,
				wasSSRAttempted: true, // true only when SSR is non-lazy
				wasSSRSuccessful: false,
			};

			completeUfoExperience(
				id,
				'complete',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
				undefined,
				ssrPreviewInfo,
			);

			expect(mockAddMetadata).toHaveBeenCalledWith(
				expect.objectContaining({
					timingStrategy: 'ssr-failed',
				}),
			);
			expect(mockMark).toHaveBeenCalledWith('interactionStart', 0);
		});

		it('should add CSR mount-based timing strategy when no SSR was used', () => {
			completeUfoExperience(
				id,
				'complete',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
				undefined,
				undefined,
			);

			expect(mockAddMetadata).toHaveBeenCalledWith(
				expect.objectContaining({
					timingStrategy: 'csr-mount-based',
				}),
			);
		});

		it('should add CSR mount-based timing strategy when SSR was lazy loaded', () => {
			// When SSR is lazy, wasSSRAttempted should be false (set by fileCard.tsx)
			const ssrPreviewInfo = {
				dataUri: 'https://media.prod.atl-paas.net/file/test-file-id/image',
				wasSSRAttempted: false, // false because SSR was lazy
				wasSSRSuccessful: false,
			};

			completeUfoExperience(
				id,
				'complete',
				fileAttributes,
				{ wasStatusUploading: false, wasStatusProcessing: false },
				ssrReliability,
				undefined,
				ssrPreviewInfo,
			);

			expect(mockAddMetadata).toHaveBeenCalledWith(
				expect.objectContaining({
					timingStrategy: 'csr-mount-based',
				}),
			);
		});
	});
});

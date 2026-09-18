import type { ProcessingFailedState } from '@atlaskit/media-state/file-state';

import { mapSsrMediaItemToFileState } from '../../ssr-media-item';
import type { SsrMediaItem, SsrMediaItemDetails } from '../../ssr-media-item';

describe('mapSsrMediaItemToFileState', () => {
	const baseSsrMediaItemDetails: SsrMediaItemDetails = {
		name: 'test-file.png',
		size: 1000,
		mimeType: 'image/png',
		mediaType: 'image',
		processingStatus: 'pending',
		artifactsList: [],
		representations: {},
	};

	const baseSsrMediaItem: SsrMediaItem = {
		id: 'some-file-id',
		type: 'file',
		details: baseSsrMediaItemDetails,
	};

	describe('happy path', () => {
		it('should map a fully-populated succeeded item to processed FileState', () => {
			const item: SsrMediaItem = {
				id: 'test-id-123',
				type: 'file',
				details: {
					name: 'document.pdf',
					size: 5000,
					mimeType: 'application/pdf',
					mediaType: 'doc',
					processingStatus: 'succeeded',
					createdAt: 1625097600000,
					artifactsList: [],
					representations: {},
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeDefined();
			expect(fileState?.id).toBe('test-id-123');
			expect(fileState?.status).toBe('processed');
			expect((fileState as any)?.name).toBe('document.pdf');
			expect((fileState as any)?.size).toBe(5000);
			expect((fileState as any)?.mimeType).toBe('application/pdf');
			expect((fileState as any)?.mediaType).toBe('doc');
			expect((fileState as any)?.createdAt).toBe(1625097600000);
		});

		it('should map succeeded item with all optional fields', () => {
			const item: SsrMediaItem = {
				id: 'complete-id',
				type: 'file',
				details: {
					name: 'image.jpg',
					size: 2500,
					mimeType: 'image/jpeg',
					mediaType: 'image',
					processingStatus: 'succeeded',
					createdAt: 1625097600000,
					preview: { cdnUrl: 'https://example.com/preview.jpg' },
					representations: { image: { _empty: false } },
					mediaMetadata: { duration: 120 },
					abuseClassification: { classification: 'clean', confidence: 'high' },
					artifactsList: [],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeDefined();
			expect(fileState?.id).toBe('complete-id');
			expect(fileState?.status).toBe('processed');
			expect((fileState as any)?.name).toBe('image.jpg');
			expect((fileState as any)?.previewCdnUrl).toBe('https://example.com/preview.jpg');
			expect((fileState as any)?.mediaMetadata?.duration).toBe(120);
			expect((fileState as any)?.abuseClassification).toEqual({
				classification: 'clean',
				confidence: 'high',
			});
			expect((fileState as any)?.representations?.image).toEqual({});
		});
	});

	describe('non-terminal statuses', () => {
		it('should map pending status to processing state', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					processingStatus: 'pending',
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState?.status).toBe('processing');
			expect(fileState?.id).toBe('some-file-id');
			expect((fileState as any)?.failReason).toBeUndefined();
		});

		it('should return undefined for an unsupported processing status', () => {
			// The only valid MediaFileProcessingStatus values are
			// 'pending' | 'succeeded' | 'failed'. An unrecognised status (here
			// 'processing') cannot be mapped, so the mapper returns undefined and
			// SSR safely falls back to a normal fetch.
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					processingStatus: 'processing',
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});
	});

	describe('failed processing', () => {
		it('should map failed status without failReason', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					processingStatus: 'failed',
				},
			};

			const fileState = mapSsrMediaItemToFileState(item) as ProcessingFailedState;

			expect(fileState.status).toBe('failed-processing');
			expect(fileState.id).toBe('some-file-id');
			expect(fileState.failReason).toBeUndefined();
		});

		it('should map failed status with failReason', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					processingStatus: 'failed',
					failReason: 'timeout',
				},
			};

			const fileState = mapSsrMediaItemToFileState(item) as ProcessingFailedState;

			expect(fileState.status).toBe('failed-processing');
			expect(fileState.failReason).toBe('timeout');
		});

		it('should preserve different failReason values', () => {
			const failReasons = [
				'operation-failed',
				'timeout',
				'unsupported-file-type',
				'unknown',
			] as const;

			failReasons.forEach((failReason) => {
				const item: SsrMediaItem = {
					...baseSsrMediaItem,
					details: {
						...baseSsrMediaItemDetails,
						processingStatus: 'failed',
						failReason,
					},
				};

				const fileState = mapSsrMediaItemToFileState(item) as ProcessingFailedState;

				expect(fileState.status).toBe('failed-processing');
				expect(fileState.failReason).toBe(failReason);
			});
		});
	});

	describe('missing required fields', () => {
		it('should return undefined for null input', () => {
			const fileState = mapSsrMediaItemToFileState(null);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined for undefined input', () => {
			const fileState = mapSsrMediaItemToFileState(undefined);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when id is missing', () => {
			const item: SsrMediaItem = {
				type: 'file',
				details: baseSsrMediaItemDetails,
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when details is missing', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when details is null', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: null,
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when name is missing', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					name: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when name is null', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					name: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when mimeType is missing', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					mimeType: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when mimeType is null', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					mimeType: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when mediaType is missing', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					mediaType: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when mediaType is null', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					mediaType: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when processingStatus is missing', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					processingStatus: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when processingStatus is null', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					processingStatus: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when size is missing', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					size: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined when size is null', () => {
			const item: SsrMediaItem = {
				id: 'some-file-id',
				type: 'file',
				details: {
					...baseSsrMediaItemDetails,
					size: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect(fileState).toBeUndefined();
		});
	});

	describe('artifactsList to artifacts', () => {
		it('should convert empty artifactsList to empty artifacts dict', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.artifacts).toEqual({});
		});

		it('should convert null artifactsList to empty artifacts dict', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.artifacts).toEqual({});
		});

		it('should convert artifactsList to keyed artifacts dict', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'image.png',
							url: 'https://example.com/image.png',
							processingStatus: 'succeeded',
							size: 500,
							mimeType: 'image/png',
							createdAt: 1625097600000,
						},
						{
							name: 'thumb_120.jpg',
							url: 'https://example.com/thumb.jpg',
							processingStatus: 'succeeded',
							size: 50,
							mimeType: 'image/jpeg',
						},
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifacts = (fileState as any)?.artifacts;

			expect(artifacts['image.png']).toBeDefined();
			expect(artifacts['image.png'].url).toBe('https://example.com/image.png');
			expect(artifacts['image.png'].processingStatus).toBe('succeeded');
			expect(artifacts['image.png'].size).toBe(500);
			expect(artifacts['image.png'].mimeType).toBe('image/png');
			expect(artifacts['image.png'].createdAt).toBe(1625097600000);

			expect(artifacts['thumb_120.jpg']).toBeDefined();
			expect(artifacts['thumb_120.jpg'].url).toBe('https://example.com/thumb.jpg');
			expect(artifacts['thumb_120.jpg'].size).toBe(50);
		});

		it('should skip artifacts missing name', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'valid.png',
							url: 'https://example.com/valid.png',
							processingStatus: 'succeeded',
						},
						{
							url: 'https://example.com/invalid.png',
							processingStatus: 'succeeded',
						} as any,
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifacts = (fileState as any)?.artifacts;

			expect(Object.keys(artifacts)).toHaveLength(1);
			expect(artifacts['valid.png']).toBeDefined();
		});

		it('should skip artifacts missing url', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'valid.png',
							url: 'https://example.com/valid.png',
							processingStatus: 'succeeded',
						},
						{
							name: 'invalid.png',
							processingStatus: 'succeeded',
						} as any,
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifacts = (fileState as any)?.artifacts;

			expect(Object.keys(artifacts)).toHaveLength(1);
			expect(artifacts['valid.png']).toBeDefined();
		});

		it('should skip artifacts missing processingStatus', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'valid.png',
							url: 'https://example.com/valid.png',
							processingStatus: 'succeeded',
						},
						{
							name: 'invalid.png',
							url: 'https://example.com/invalid.png',
						} as any,
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifacts = (fileState as any)?.artifacts;

			expect(Object.keys(artifacts)).toHaveLength(1);
			expect(artifacts['valid.png']).toBeDefined();
		});

		it('should skip artifacts with null name', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: null,
							url: 'https://example.com/invalid.png',
							processingStatus: 'succeeded',
						} as any,
						{
							name: 'valid.png',
							url: 'https://example.com/valid.png',
							processingStatus: 'succeeded',
						},
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifacts = (fileState as any)?.artifacts;

			expect(Object.keys(artifacts)).toHaveLength(1);
			expect(artifacts['valid.png']).toBeDefined();
		});

		it('should include optional artifact fields when present', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'complete.png',
							url: 'https://example.com/complete.png',
							processingStatus: 'succeeded',
							size: 1000,
							mimeType: 'image/png',
							createdAt: 1625097600000,
						},
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifact = (fileState as any)?.artifacts['complete.png'];

			expect(artifact.size).toBe(1000);
			expect(artifact.mimeType).toBe('image/png');
			expect(artifact.createdAt).toBe(1625097600000);
		});
	});

	describe('numeric coercion', () => {
		it('should coerce size from number to number', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					size: 2500,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.size).toBe(2500);
			expect(typeof (fileState as any)?.size).toBe('number');
		});

		it('should coerce createdAt from number to number', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					createdAt: 1625097600000,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.createdAt).toBe(1625097600000);
			expect(typeof (fileState as any)?.createdAt).toBe('number');
		});

		it('should coerce artifact size from number to number', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'test.png',
							url: 'https://example.com/test.png',
							processingStatus: 'succeeded',
							size: 500,
						},
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifact = (fileState as any)?.artifacts['test.png'];

			expect(artifact.size).toBe(500);
			expect(typeof artifact.size).toBe('number');
		});

		it('should coerce artifact createdAt from number to number', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					artifactsList: [
						{
							name: 'test.png',
							url: 'https://example.com/test.png',
							processingStatus: 'succeeded',
							createdAt: 1625097600000,
						},
					],
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);
			const artifact = (fileState as any)?.artifacts['test.png'];

			expect(artifact.createdAt).toBe(1625097600000);
			expect(typeof artifact.createdAt).toBe('number');
		});
	});

	describe('optional passthroughs', () => {
		it('should map preview.cdnUrl to previewCdnUrl', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					preview: { cdnUrl: 'https://example.com/preview.jpg' },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.previewCdnUrl).toBe('https://example.com/preview.jpg');
		});

		it('should not include previewCdnUrl when preview is missing', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					preview: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.previewCdnUrl).toBeUndefined();
		});

		it('should not include previewCdnUrl when preview is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					preview: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.previewCdnUrl).toBeUndefined();
		});

		it('should not include previewCdnUrl when cdnUrl is missing', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					preview: { cdnUrl: undefined },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.previewCdnUrl).toBeUndefined();
		});

		it('should not include previewCdnUrl when cdnUrl is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					preview: { cdnUrl: null },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.previewCdnUrl).toBeUndefined();
		});

		it('should map mediaMetadata.duration', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					mediaMetadata: { duration: 120 },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.mediaMetadata?.duration).toBe(120);
		});

		it('should not include mediaMetadata when missing', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					mediaMetadata: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.mediaMetadata).toBeUndefined();
		});

		it('should not include mediaMetadata when null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					mediaMetadata: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.mediaMetadata).toBeUndefined();
		});

		it('should not include mediaMetadata when duration is missing', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					mediaMetadata: { duration: undefined },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.mediaMetadata).toBeUndefined();
		});

		it('should not include mediaMetadata when duration is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					mediaMetadata: { duration: null },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.mediaMetadata).toBeUndefined();
		});

		it('should map representations.image to { image: {} }', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					representations: { image: { _empty: false } },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.representations?.image).toEqual({});
		});

		it('should map representations.image with null _empty', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					representations: { image: { _empty: null } },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.representations?.image).toEqual({});
		});

		it('should not include representations.image when image is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					representations: { image: null },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.representations?.image).toBeUndefined();
		});

		it('should not include representations.image when representations is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					representations: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.representations).toEqual({});
		});

		it('should include abuseClassification when both classification and confidence are present', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: { classification: 'clean', confidence: 'high' },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toEqual({
				classification: 'clean',
				confidence: 'high',
			});
		});

		it('should not include abuseClassification when classification is missing', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: { confidence: 'high' } as any,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toBeUndefined();
		});

		it('should not include abuseClassification when confidence is missing', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: { classification: 'clean' } as any,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toBeUndefined();
		});

		it('should not include abuseClassification when classification is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: { classification: null, confidence: 'high' },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toBeUndefined();
		});

		it('should not include abuseClassification when confidence is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: { classification: 'clean', confidence: null },
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toBeUndefined();
		});

		it('should not include abuseClassification when object is null', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: null,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toBeUndefined();
		});

		it('should not include abuseClassification when undefined', () => {
			const item: SsrMediaItem = {
				...baseSsrMediaItem,
				details: {
					...baseSsrMediaItemDetails,
					abuseClassification: undefined,
				},
			};

			const fileState = mapSsrMediaItemToFileState(item);

			expect((fileState as any)?.abuseClassification).toBeUndefined();
		});
	});

	describe('no throw on malformed input', () => {
		it('should return undefined for empty object', () => {
			const fileState = mapSsrMediaItemToFileState({} as any);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined for object with only id', () => {
			const fileState = mapSsrMediaItemToFileState({ id: 'test-id' } as any);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined for deeply wrong types', () => {
			const fileState = mapSsrMediaItemToFileState('string' as any);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined for numeric input', () => {
			const fileState = mapSsrMediaItemToFileState(123 as any);

			expect(fileState).toBeUndefined();
		});

		it('should return undefined for boolean input', () => {
			const fileState = mapSsrMediaItemToFileState(true as any);

			expect(fileState).toBeUndefined();
		});

		it('should not throw when details has unexpected structure', () => {
			expect(() => {
				mapSsrMediaItemToFileState({
					id: 'test-id',
					details: { some: 'random', structure: 123 },
				} as any);
			}).not.toThrow();
		});

		it('should return undefined when details is an array', () => {
			const fileState = mapSsrMediaItemToFileState({
				id: 'test-id',
				details: [],
			} as any);

			expect(fileState).toBeUndefined();
		});
	});
});

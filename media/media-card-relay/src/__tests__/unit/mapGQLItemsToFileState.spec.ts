/**
 * Unit tests for `mapGQLItemsToFileState`.
 *
 * Covers:
 * - early-exit guards (null / undefined / partial payloads)
 * - happy-path field-by-field shape (id, name, size, mimeType, mediaType,
 *   processingStatus → FileState.status mapping)
 * - `artifactsList` (array) → `artifacts` (keyed dict) reshape, including
 *   dropping entries with missing `name` / `url` / `processingStatus`
 * - optional fields: `createdAt`, `mediaMetadata.duration`,
 *   `representations.image`, `abuseClassification`
 */
import type { mediaCardFragment_mediaItem$data } from '../../__generated__/mediaCardFragment_mediaItem.graphql';
import { mapGQLItemsToFileState } from '../../utils/mapGQLItemsToFileState';

type FragmentData = mediaCardFragment_mediaItem$data;
type FragmentDetails = FragmentData['details'];

const baseDetails = (): FragmentDetails => ({
	name: 'test-image.jpg',
	size: 204800,
	mimeType: 'image/jpeg',
	mediaType: 'image',
	processingStatus: 'succeeded',
	failReason: null,
	createdAt: null,
	preview: { cdnUrl: 'https://cdn.example.com/preview.jpg' },
	artifactsList: null,
	representations: null,
	mediaMetadata: null,
	abuseClassification: null,
});

const buildFragment = (overrides?: {
	id?: string;
	type?: string;
	details?: Partial<FragmentDetails> | null;
}): FragmentData => {
	const detailsOverride = overrides?.details;
	const details =
		detailsOverride === null
			? (null as unknown as FragmentDetails)
			: { ...baseDetails(), ...(detailsOverride ?? {}) };

	return {
		id: overrides?.id ?? 'file-id-123',
		type: overrides?.type ?? 'file',
		details,
		' $fragmentType': 'mediaCardFragment_mediaItem',
	} as unknown as FragmentData;
};

describe('mapGQLItemsToFileState', () => {
	describe('early-exit guards', () => {
		it('returns undefined when mediaItem is undefined', () => {
			expect(mapGQLItemsToFileState(undefined)).toBeUndefined();
		});

		it('returns undefined when mediaItem is null', () => {
			expect(mapGQLItemsToFileState(null)).toBeUndefined();
		});

		it('returns undefined when id is missing', () => {
			expect(mapGQLItemsToFileState(buildFragment({ id: '' }))).toBeUndefined();
		});

		it('returns undefined when details is missing', () => {
			expect(mapGQLItemsToFileState(buildFragment({ details: null }))).toBeUndefined();
		});

		it.each([
			['name', { name: null }],
			['mimeType', { mimeType: null }],
			['mediaType', { mediaType: null }],
			['processingStatus', { processingStatus: null }],
			['size', { size: null }],
		])('returns undefined when required detail %s is missing', (_field, override) => {
			expect(
				mapGQLItemsToFileState(buildFragment({ details: override as Partial<FragmentDetails> })),
			).toBeUndefined();
		});
	});

	describe('happy path', () => {
		it('maps a minimal valid fragment to a processed FileState', () => {
			const result = mapGQLItemsToFileState(buildFragment());

			expect(result).toEqual(
				expect.objectContaining({
					status: 'processed',
					id: 'file-id-123',
					name: 'test-image.jpg',
					size: 204800,
					mimeType: 'image/jpeg',
					mediaType: 'image',
					artifacts: {},
					representations: {},
				}),
			);
		});

		it.each([
			['pending', 'processing'],
			['succeeded', 'processed'],
			['failed', 'failed-processing'],
		])('maps processingStatus=%s to FileState.status=%s', (gqlStatus, fileStateStatus) => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { processingStatus: gqlStatus } }),
			);
			expect(result).toBeDefined();
			expect(result!.status).toBe(fileStateStatus);
		});

		it('coerces AGG$Long size to a number', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { size: '987654' as unknown as number } }),
			);
			expect(result).toBeDefined();
			expect((result as { size: number }).size).toBe(987654);
		});
	});

	describe('createdAt', () => {
		it('leaves createdAt undefined when GQL value is null', () => {
			const result = mapGQLItemsToFileState(buildFragment());
			expect(result).toBeDefined();
			expect((result as { createdAt?: number }).createdAt).toBeUndefined();
		});

		it('coerces AGG$Long createdAt to a number when present', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { createdAt: '1700000000000' as unknown as number } }),
			);
			expect(result).toBeDefined();
			expect((result as { createdAt?: number }).createdAt).toBe(1700000000000);
		});
	});

	describe('representations', () => {
		it('returns empty representations when image is absent', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { representations: null } }),
			);
			expect(result).toBeDefined();
			expect((result as { representations: object }).representations).toEqual({});
		});

		it('returns { image: {} } when representations.image is present', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { representations: { image: { _empty: true } } } }),
			);
			expect(result).toBeDefined();
			expect((result as { representations: object }).representations).toEqual({ image: {} });
		});
	});

	describe('mediaMetadata', () => {
		it('leaves mediaMetadata undefined when duration is null', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { mediaMetadata: { duration: null } } }),
			);
			expect(result).toBeDefined();
			expect(
				(result as { mediaMetadata?: { duration: number } }).mediaMetadata,
			).toBeUndefined();
		});

		it('forwards duration when present', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { mediaMetadata: { duration: 42 } } }),
			);
			expect(result).toBeDefined();
			expect((result as { mediaMetadata?: { duration: number } }).mediaMetadata).toEqual({
				duration: 42,
			});
		});
	});

	describe('abuseClassification', () => {
		it('leaves abuseClassification undefined when both fields are null', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: { abuseClassification: { classification: null, confidence: null } },
				}),
			);
			expect(result).toBeDefined();
			expect(
				(result as { abuseClassification?: object }).abuseClassification,
			).toBeUndefined();
		});

		it('leaves abuseClassification undefined when classification is missing', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: { abuseClassification: { classification: null, confidence: 'HIGH' } },
				}),
			);
			expect(result).toBeDefined();
			expect(
				(result as { abuseClassification?: object }).abuseClassification,
			).toBeUndefined();
		});

		it('leaves abuseClassification undefined when confidence is missing', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: {
						abuseClassification: { classification: 'MALICIOUS', confidence: null },
					},
				}),
			);
			expect(result).toBeDefined();
			expect(
				(result as { abuseClassification?: object }).abuseClassification,
			).toBeUndefined();
		});

		it('forwards abuseClassification when both fields are present', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: {
						abuseClassification: { classification: 'MALICIOUS', confidence: 'HIGH' },
					},
				}),
			);
			expect(result).toBeDefined();
			expect(
				(result as { abuseClassification?: object }).abuseClassification,
			).toEqual({ classification: 'MALICIOUS', confidence: 'HIGH' });
		});
	});

	describe('artifactsList → artifacts', () => {
		it('returns empty artifacts when artifactsList is null', () => {
			const result = mapGQLItemsToFileState(buildFragment({ details: { artifactsList: null } }));
			expect(result).toBeDefined();
			expect((result as { artifacts: object }).artifacts).toEqual({});
		});

		it('returns empty artifacts when artifactsList is empty', () => {
			const result = mapGQLItemsToFileState(buildFragment({ details: { artifactsList: [] } }));
			expect(result).toBeDefined();
			expect((result as { artifacts: object }).artifacts).toEqual({});
		});

		it('keys artifacts by name and forwards required + optional fields', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: {
						artifactsList: [
							{
								name: 'image.jpg',
								url: 'https://cdn.example.com/image.jpg',
								processingStatus: 'succeeded',
								mimeType: 'image/jpeg',
								size: '12345' as unknown as number,
								createdAt: '1700000000000' as unknown as number,
							},
						],
					},
				}),
			);

			expect(result).toBeDefined();
			expect((result as { artifacts: Record<string, unknown> }).artifacts).toEqual({
				'image.jpg': {
					url: 'https://cdn.example.com/image.jpg',
					processingStatus: 'succeeded',
					mimeType: 'image/jpeg',
					size: 12345,
					createdAt: 1700000000000,
				},
			});
		});

		it('omits optional fields on the artifact when GQL values are null', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: {
						artifactsList: [
							{
								name: 'thumb_120.jpg',
								url: 'https://cdn.example.com/thumb_120.jpg',
								processingStatus: 'pending',
								mimeType: null,
								size: null,
								createdAt: null,
							},
						],
					},
				}),
			);

			expect(result).toBeDefined();
			expect((result as { artifacts: Record<string, unknown> }).artifacts).toEqual({
				'thumb_120.jpg': {
					url: 'https://cdn.example.com/thumb_120.jpg',
					processingStatus: 'pending',
				},
			});
		});

		it.each([
			['name', { name: '' as unknown as string }],
			['url', { url: null }],
			['processingStatus', { processingStatus: null }],
		])(
			'drops artifact entries that are missing %s',
			(_field, partial: Record<string, unknown>) => {
				const result = mapGQLItemsToFileState(
					buildFragment({
						details: {
							artifactsList: [
								{
									name: 'image.jpg',
									url: 'https://cdn.example.com/image.jpg',
									processingStatus: 'succeeded',
									mimeType: null,
									size: null,
									createdAt: null,
									...partial,
								} as FragmentDetails['artifactsList'] extends ReadonlyArray<infer T> | null | undefined
									? T
									: never,
							],
						},
					}),
				);

				expect(result).toBeDefined();
				expect((result as { artifacts: Record<string, unknown> }).artifacts).toEqual({});
			},
		);

		it('keeps valid entries while dropping invalid siblings in the same list', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: {
						artifactsList: [
							{
								name: 'image.jpg',
								url: 'https://cdn.example.com/image.jpg',
								processingStatus: 'succeeded',
								mimeType: 'image/jpeg',
								size: null,
								createdAt: null,
							},
							{
								name: 'broken',
								url: null,
								processingStatus: 'succeeded',
								mimeType: null,
								size: null,
								createdAt: null,
							},
						],
					},
				}),
			);

			expect(result).toBeDefined();
			const artifacts = (result as { artifacts: Record<string, unknown> }).artifacts;
			expect(Object.keys(artifacts)).toEqual(['image.jpg']);
		});
	});

	describe('previewCdnUrl', () => {
		it('copies preview.cdnUrl through as previewCdnUrl when present', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({
					details: { preview: { cdnUrl: 'https://cdn.example.com/preview.jpg' } },
				}),
			);
			expect(result).toBeDefined();
			expect((result as { previewCdnUrl?: string }).previewCdnUrl).toBe(
				'https://cdn.example.com/preview.jpg',
			);
		});

		it('leaves previewCdnUrl undefined when preview is null', () => {
			const result = mapGQLItemsToFileState(buildFragment({ details: { preview: null } }));
			expect(result).toBeDefined();
			expect((result as { previewCdnUrl?: string }).previewCdnUrl).toBeUndefined();
		});

		it('leaves previewCdnUrl undefined when preview.cdnUrl is null', () => {
			const result = mapGQLItemsToFileState(
				buildFragment({ details: { preview: { cdnUrl: null } } }),
			);
			expect(result).toBeDefined();
			expect((result as { previewCdnUrl?: string }).previewCdnUrl).toBeUndefined();
		});
	});
});

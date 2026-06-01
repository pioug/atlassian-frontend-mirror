import {
	mapMediaItemToFileState,
	type FileState,
	type MediaFileArtifacts,
	type MediaFileProcessingStatus,
	type MediaItemDetails,
	type MediaType,
} from '@atlaskit/media-client';
import type { ProcessingFailReason } from '@atlaskit/media-state';

import type { mediaCardFragment_mediaItem$data } from '../__generated__/mediaCardFragment_mediaItem.graphql';

type FragmentDetails = mediaCardFragment_mediaItem$data['details'];
type ArtifactsList = NonNullable<FragmentDetails['artifactsList']>;
type AbuseClassification = NonNullable<MediaItemDetails['abuseClassification']>;

const toNumber = (value: number | null | undefined): number | undefined =>
	value == null ? undefined : Number(value);

const toAbuseClassification = (
	value: FragmentDetails['abuseClassification'],
): AbuseClassification | undefined => {
	if (!value || !value.classification || !value.confidence) {
		return undefined;
	}
	return {
		classification: value.classification as AbuseClassification['classification'],
		confidence: value.confidence as AbuseClassification['confidence'],
	};
};

/**
 * Convert the GQL `artifactsList` array shape into the keyed `MediaFileArtifacts`
 * dict that `MediaItemDetails` / `FileState` consumers expect.
 *
 * Each artifact is keyed by its `name` (e.g. `'image.png'`, `'thumb_120.jpg'`).
 * Artifacts missing required fields (`name`, `url`, narrowed `processingStatus`)
 * are dropped rather than coerced — callers should treat absent artifacts as
 * "not yet available" rather than "failed".
 *
 * NOTE: this assumes AGG returns `name` values matching the canonical
 * `MediaFileArtifacts` key vocabulary. If that assumption is broken, the
 * downstream renderer will silently miss SSR thumbnails — verify with a real
 * fragment payload before relying on SSR previews.
 */
const toArtifacts = (list: ArtifactsList | null | undefined): MediaFileArtifacts => {
	const out: MediaFileArtifacts = {};
	if (!list) {
		return out;
	}
	for (const item of list) {
		if (!item.name || !item.url || !item.processingStatus) {
			continue;
		}
		const artifact: MediaFileArtifacts[keyof MediaFileArtifacts] = {
			processingStatus: item.processingStatus as MediaFileProcessingStatus,
			url: item.url,
			...(item.mimeType ? { mimeType: item.mimeType } : {}),
			...(item.size != null ? { size: Number(item.size) } : {}),
			...(item.createdAt != null ? { createdAt: Number(item.createdAt) } : {}),
		};
		(out as Record<string, MediaFileArtifacts[keyof MediaFileArtifacts]>)[item.name] = artifact;
	}
	return out;
};

/**
 * Map a `mediaCardFragment_mediaItem` GraphQL fragment payload to a `FileState`
 * suitable for passing as `ssrFileState` to `<Card />` / `<MediaInlineCard />`.
 *
 * Returns `undefined` when:
 * - `mediaItem` is null/undefined or missing `id`/`details`
 * - any of the required `MediaFile` fields (`name`, `mimeType`, `mediaType`,
 *   `processingStatus`) are missing or fail enum narrowing
 *
 * The transformation reshapes `details.artifactsList` (array, GQL-only) into
 * the keyed `details.artifacts` dict expected by `mapMediaItemToFileState`,
 * narrows open `string` enums, and coerces `AGG$Long` numerics.
 */
export const mapGQLItemsToFileState = (
	mediaItem: mediaCardFragment_mediaItem$data | null | undefined,
): FileState | undefined => {
	if (!mediaItem?.id || !mediaItem.details) {
		return undefined;
	}

	const d = mediaItem.details;

	const processingStatus = d.processingStatus;
	const mediaType = d.mediaType;
	const size = toNumber(d.size);

	if (!d.name || !d.mimeType || !mediaType || !processingStatus || size === undefined) {
		return undefined;
	}

	const abuseClassification = toAbuseClassification(d.abuseClassification);
	const details: MediaItemDetails = {
		name: d.name,
		mimeType: d.mimeType,
		mediaType: mediaType as MediaType,
		processingStatus: processingStatus as MediaFileProcessingStatus,
		size,
		artifacts: toArtifacts(d.artifactsList),
		failReason: d.failReason as ProcessingFailReason,
		representations: d.representations?.image ? { image: {} } : {},
		...(d.createdAt != null ? { createdAt: Number(d.createdAt) } : {}),
		...(d.mediaMetadata?.duration != null
			? { mediaMetadata: { duration: d.mediaMetadata.duration } }
			: {}),
		...(abuseClassification ? { abuseClassification } : {}),
		...(d.preview?.cdnUrl ? { previewCdnUrl: d.preview.cdnUrl } : {}),
	};

	return mapMediaItemToFileState(mediaItem.id, details);
};

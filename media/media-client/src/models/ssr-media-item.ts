import type {
	FileState,
	MediaFileArtifacts,
	ProcessingFailReason,
} from '@atlaskit/media-state/file-state';

import { mapMediaItemToFileState } from './file-state';
import type { MediaFileProcessingStatus, MediaItemDetails, MediaType } from './media';

/**
 * Describes the shape of a plain recorded AGG media item as serialized by Confluence SSR.
 * All fields are optional/nullable to tolerate untrusted runtime JSON from window globals.
 *
 * This is the shape as returned by dt-api-filestore `media_items` aggregation.
 */
export interface SsrMediaItemDetails {
	readonly name?: string | null;
	readonly size?: number | null;
	readonly mimeType?: string | null;
	readonly mediaType?: string | null;
	readonly processingStatus?: string | null;
	readonly failReason?: string | null;
	readonly createdAt?: number | null;
	readonly preview?: {
		readonly cdnUrl?: string | null;
	} | null;
	readonly artifactsList?: ReadonlyArray<{
		readonly createdAt?: number | null;
		readonly mimeType?: string | null;
		readonly name?: string;
		readonly processingStatus?: string | null;
		readonly size?: number | null;
		readonly url?: string | null;
	}> | null;
	readonly representations?: {
		readonly image?: {
			readonly _empty?: boolean | null;
		} | null;
	} | null;
	readonly mediaMetadata?: {
		readonly duration?: number | null;
	} | null;
	readonly abuseClassification?: {
		readonly classification?: string | null;
		readonly confidence?: string | null;
	} | null;
}

/**
 * Describes a complete SSR media item with id and details.
 * All fields are optional/nullable to tolerate untrusted runtime JSON from window globals.
 */
export interface SsrMediaItem {
	readonly id?: string;
	readonly type?: string;
	readonly details?: SsrMediaItemDetails | null;
}

/**
 * Safely coerce a value to a number, returning undefined if the value is null/undefined.
 */
const toNumber = (value: number | null | undefined): number | undefined =>
	value == null ? undefined : Number(value);

/**
 * Convert abuse classification fields to the keyed format expected by FileState,
 * returning undefined if either classification or confidence is missing/falsy.
 */
const toAbuseClassification = (
	value: SsrMediaItemDetails['abuseClassification'],
): NonNullable<MediaItemDetails['abuseClassification']> | undefined => {
	if (!value || !value.classification || !value.confidence) {
		return undefined;
	}
	return {
		classification: value.classification as NonNullable<
			MediaItemDetails['abuseClassification']
		>['classification'],
		confidence: value.confidence as NonNullable<
			MediaItemDetails['abuseClassification']
		>['confidence'],
	};
};

/**
 * Convert the `artifactsList` array shape into the keyed `MediaFileArtifacts`
 * dict that `MediaItemDetails` / `FileState` consumers expect.
 *
 * Each artifact is keyed by its `name` (e.g. `'image.png'`, `'thumb_120.jpg'`).
 * Artifacts missing required fields (`name`, `url`, `processingStatus`)
 * are skipped rather than coerced — callers should treat absent artifacts as
 * "not yet available" rather than "failed".
 *
 * NOTE: This assumes AGG returns `name` values matching the canonical
 * `MediaFileArtifacts` key vocabulary. If that assumption is broken, the
 * downstream renderer will silently miss SSR thumbnails — verify with a real
 * payload before relying on SSR previews.
 */
const toArtifacts = (list: SsrMediaItemDetails['artifactsList']): MediaFileArtifacts => {
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
 * Map a plain SSR media item (from AGG / dt-api-filestore) to a `FileState`
 * for seeding `<Card />` / `<MediaInlineCard />`.
 *
 * Returns `undefined` when:
 * - `item` is null/undefined or missing `id`/`details`
 * - any of the required `MediaFile` fields (`name`, `mimeType`, `mediaType`,
 *   `processingStatus`) are missing or falsy
 * - `size` is missing or cannot be coerced to a number
 *
 * The transformation reshapes `details.artifactsList` (array, AGG-only) into
 * the keyed `details.artifacts` dict expected by `mapMediaItemToFileState`,
 * and coerces `AGG$Long` numerics.
 *
 * MUST NOT throw on malformed input — always return undefined instead.
 */
export const mapSsrMediaItemToFileState = (
	item: SsrMediaItem | null | undefined,
): FileState | undefined => {
	try {
		if (!item?.id || !item.details) {
			return undefined;
		}

		const d = item.details;

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
			representations: d.representations?.image ? { image: {} } : {},
			...(d.failReason ? { failReason: d.failReason as ProcessingFailReason } : {}),
			...(d.createdAt != null ? { createdAt: Number(d.createdAt) } : {}),
			...(d.mediaMetadata?.duration != null
				? { mediaMetadata: { duration: d.mediaMetadata.duration } }
				: {}),
			...(abuseClassification ? { abuseClassification } : {}),
			...(d.preview?.cdnUrl ? { previewCdnUrl: d.preview.cdnUrl } : {}),
		};

		return mapMediaItemToFileState(item.id, details);
	} catch {
		// Silently catch any unexpected errors and return undefined
		return undefined;
	}
};

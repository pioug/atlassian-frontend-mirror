/**
 * INTERIM MOCK UTILITIES — will be replaced when the AGG MediaItem schema lands (Phases 1-4 of BMPT-7771).
 * At that point, use useLazyLoadQuery + fragment spread instead of useMockMediaItemRef.
 */

import React, { useMemo, useEffect, useContext } from 'react';

import { RelayEnvironmentProvider, ReactRelayContext } from 'react-relay';
import { commitLocalUpdate, Environment, Network, RecordSource, Store } from 'relay-runtime';

import type { mediaCardFragment_mediaItem$key } from '../../src/__generated__/mediaCardFragment_mediaItem.graphql';
// Import the compiled fragment node so fakeOwner uses the real AST (with selections)
// rather than a hand-crafted stub — RelayReader requires a non-empty selections array
// to traverse the store record without crashing.
import mediaCardFragmentNode from '../../src/__generated__/mediaCardFragment_mediaItem.graphql';

const MOCK_PREVIEW_URL =
	'https://images.unsplash.com/photo-1696041759885-16f488660bea?w=720&Signature=example-signed-url';
/**
 * A mock fragment ref usable by both MediaCardRelay and MediaInlineCardRelay.
 * Both fragments select the same fields on MediaItem, so we set both fragment
 * markers on a single ref — Relay's useFragment reads __fragments[fragmentName],
 * and both lookups will resolve to the same underlying record.
 */
export type MockMediaItemRef = mediaCardFragment_mediaItem$key;

enum ProcessingStatus {
	Pending = 'pending',
	Running = 'running',
	Succeeded = 'succeeded',
	Failed = 'failed',
}

/**
 * Options for customizing mock MediaItem fixture data.
 */
export interface UseMockMediaItemRefOptions {
	/**
	 * Optional explicit id for the mock MediaItem record. When provided this is
	 * used as both the Relay store `__id` and the `MediaItem.id` field value, so
	 * it can be aligned with the `FileIdentifier.id` passed to the consuming
	 * MediaCardRelay / MediaInlineCardRelay.
	 *
	 * MUST be stable across renders; callers are expected to memoize or hard-code
	 * the value the same way they would for fixture overrides.
	 *
	 * When omitted, a deterministic synthetic id is derived from the other
	 * overrides (preserves the previous behavior).
	 */
	id?: string;
	mediaType?: 'image' | 'video' | 'doc' | 'audio' | 'unknown';
	processingStatus?: ProcessingStatus;
	name?: string;
	size?: number;
	mimeType?: string;
}

/**
 * RelayMock component wraps children in a RelayEnvironmentProvider with a mock environment.
 * Useful for examples and tests that need Relay context without a real server.
 */
export default function RelayMock({ children }: { children: React.ReactNode }): React.JSX.Element {
	const environment = useMemo(
		() =>
			new Environment({
				// No real network needed — all data is written via commitLocalUpdate.
				// Return an empty response for any query that somehow gets executed.
				network: Network.create(() => Promise.resolve({ data: {}, errors: undefined })),
				store: new Store(new RecordSource()),
			}),
		[],
	);

	return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
}

/**
 * Hook that creates a mock MediaItem fragment ref for use with MediaCardRelay
 * or MediaInlineCardRelay.
 *
 * @param overrides - Optional overrides for mediaType, processingStatus, name, size, mimeType
 * @returns A fragment ref that satisfies both mediaCardRelay_mediaItem$key and
 *   mediaInlineCardRelay_mediaItem$key — the same ref can be passed to either
 *   <MediaCardRelay /> or <MediaInlineCardRelay />.
 *
 * @example
 * const mediaItemRef = useMockMediaItemRef({ mediaType: 'video', name: 'my-video.mp4' });
 * return <MediaCardRelay mediaItemRef={mediaItemRef} identifier={...} mediaClientConfig={...} />;
 */
export function useMockMediaItemRef(
	overrides?: UseMockMediaItemRefOptions,
): MockMediaItemRef | null {
	// Pull the Relay environment from context (provided by <RelayMock> above).
	// The environment must exist at this point — if it doesn't, the example is
	// not wrapped in <RelayMock> and we return null so MediaCardRelay falls back to
	// the no-fragment-ref path.
	const relayContext = useContext(ReactRelayContext);
	const environment = relayContext?.environment ?? null;

	const recordId = useMemo(() => {
		// Explicit id wins so callers can align with FileIdentifier.id used by
		// MediaCardRelay / MediaInlineCardRelay.
		if (overrides?.id) {
			return overrides.id;
		}
		// Stable per-overrides id so React doesn't tear between renders.
		const seed = JSON.stringify(overrides ?? {});
		return `mock-media-item-${btoa(seed)
			.replace(/[^a-zA-Z0-9]/g, '')
			.slice(0, 16)}`;
	}, [overrides]);

	useEffect(() => {
		if (!environment) {
			return;
		}
		// Write a synthetic MediaItem record into the mock environment's store so
		// useFragment can read it back via __id. We bypass MockPayloadGenerator
		// because our hand-authored fragment artifact (pre-AGG schema) has no
		// parent operation to drive payload generation.
		// NOTE: commitLocalUpdate is a side effect (it writes to the Relay store)
		// and must be in useEffect, not useMemo — React may discard memoized
		// computations at any time without running them in concurrent/Strict Mode.
		commitLocalUpdate(environment, (store) => {
			let record = store.get(recordId);
			if (!record) {
				record = store.create(recordId, 'MediaItem');
			}
			record.setValue(recordId, 'id');
			record.setValue('MediaItem', '__typename');
			// The fragment selects `type` as a scalar field on MediaItem.
			record.setValue('file', 'type');

			// MediaFileDetails is a nested object — Relay represents nested objects
			// as separate records linked by ID. We create a child record for `details`
			// and link it from the MediaItem record.
			// IMPORTANT: the concreteType MUST match the fragment's declared
			// concreteType ('MediaFileDetails') — otherwise Relay's type-refinement
			// check returns null for the linked record.
			const detailsRecordId = `${recordId}.details`;
			let detailsRecord = store.get(detailsRecordId);
			if (!detailsRecord) {
				detailsRecord = store.create(detailsRecordId, 'MediaFileDetails');
			}
			detailsRecord.setValue(overrides?.name ?? 'sample-file.bin', 'name');
			detailsRecord.setValue(overrides?.size ?? 0, 'size');
			detailsRecord.setValue(overrides?.mimeType ?? 'application/octet-stream', 'mimeType');
			detailsRecord.setValue(overrides?.mediaType ?? 'unknown', 'mediaType');
			detailsRecord.setValue(overrides?.processingStatus ?? 'processed', 'processingStatus');

			const previewRecordId = `${detailsRecordId}.preview`;
			let previewRecord = store.get(previewRecordId);
			if (!previewRecord) {
				previewRecord = store.create(previewRecordId, 'MediaFilePreview');
			}
			previewRecord.setValue(MOCK_PREVIEW_URL, 'cdnUrl');
			detailsRecord.setLinkedRecord(previewRecord, 'preview');

			detailsRecord.setValue(null, 'failReason');
			detailsRecord.setValue(Date.now(), 'createdAt');

			// Linked records (preview, representations, mediaMetadata, abuseClassification)
			// are all nullable in the schema. We do NOT seed them — Relay's Reader
			// returns null for missing linked records by default. This avoids the
			// brittleness of setLinkedRecord(null) (which has differing behaviour
			// across Relay versions) and keeps the mock minimal.

			record.setLinkedRecord(detailsRecord, 'details');
		});
	}, [environment, recordId, overrides]);

	return useMemo(() => {
		if (!environment) {
			return null;
		}
		// Construct a Relay fragment ref. Relay's getSingularSelector reads __id,
		// __fragments, and __fragmentOwner from the ref. __fragmentOwner MUST be a
		// non-null object with a `variables` field — Relay invariants on
		// `typeof mixedOwner === 'object' && mixedOwner !== null` and then calls
		// getFragmentVariables(owner.variables, ...). Real refs carry the parent
		// query operation here; for mocks we duck-type the minimum shape.
		// Relay's getSingularSelector reads __fragmentOwner.node.params for the
		// operation name, and __fragmentOwner.fragment.node MUST be the real
		// compiled fragment AST (with `selections`) — RelayReader traverses it
		// to read fields from the store record. Using an empty-selections stub
		// causes RelayReader to receive `undefined` as its source and crash with
		// "Cannot read properties of undefined (reading 'use_exec_time_resolvers')".
		const fakeOwner = {
			variables: {},
			node: {
				params: {
					name: 'MockOperation',
					operationKind: 'query',
					id: null,
					text: null,
					metadata: {},
				},
				// RelayReader reads owner.node.operation.use_exec_time_resolvers
				// during store lookup — without this property the reader crashes with
				// "Cannot read properties of undefined (reading 'use_exec_time_resolvers')".
				operation: {},
				selections: [],
				kind: 'Operation',
			},
			fragment: {
				dataID: recordId,
				// Use the real compiled fragment node so RelayReader can traverse its
				// selections and return the correct data from the store.
				node: mediaCardFragmentNode,
				variables: {},
				isWithinUnmatchedTypeRefinement: false,
			},
		};
		return {
			__id: recordId,
			__fragments: {
				mediaCardFragment_mediaItem: {},
			},
			__fragmentOwner: fakeOwner,
		} as unknown as MockMediaItemRef;
	}, [environment, recordId]);
}

/**
 * Pre-defined fixture for a mock image item (processed, 200KB JPEG).
 */
export const MOCK_IMAGE_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'image',
	processingStatus: ProcessingStatus.Succeeded,
	name: 'sample-image.jpg',
	size: 204800,
	mimeType: 'image/jpeg',
};

/**
 * Pre-defined fixture for a mock video item (processed, 5MB MP4).
 */
export const MOCK_VIDEO_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'video',
	processingStatus: ProcessingStatus.Succeeded,
	name: 'sample-video.mp4',
	size: 5242880,
	mimeType: 'video/mp4',
};

/**
 * Pre-defined fixture for a mock PDF document (processed, 100KB).
 */
export const MOCK_PDF_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'doc',
	processingStatus: ProcessingStatus.Succeeded,
	name: 'sample-document.pdf',
	size: 102400,
	mimeType: 'application/pdf',
};

/**
 * Pre-defined fixture for a mock audio item (processed, 3MB MP3).
 */
export const MOCK_AUDIO_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'audio',
	processingStatus: ProcessingStatus.Succeeded,
	name: 'sample-audio.mp3',
	size: 3145728,
	mimeType: 'audio/mpeg',
};

/**
 * Pre-defined fixture for a mock unknown file type (processed, 512B).
 */
export const MOCK_UNKNOWN_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'unknown',
	processingStatus: ProcessingStatus.Succeeded,
	name: 'sample-file.bin',
	size: 512,
	mimeType: 'application/octet-stream',
};

/**
 * Pre-defined fixture for a mock item in processing state (0B, JPEG).
 */
export const MOCK_PROCESSING_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'image',
	processingStatus: ProcessingStatus.Running,
	name: 'uploading.jpg',
	size: 0,
	mimeType: 'image/jpeg',
};

/**
 * Pre-defined fixture for a mock item in failed state (0B, JPEG).
 */
export const MOCK_FAILED_ITEM: UseMockMediaItemRefOptions = {
	mediaType: 'image',
	processingStatus: ProcessingStatus.Failed,
	name: 'failed.jpg',
	size: 0,
	mimeType: 'image/jpeg',
};

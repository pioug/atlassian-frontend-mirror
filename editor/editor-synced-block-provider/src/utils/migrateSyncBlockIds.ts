import { traverse } from '@atlaskit/adf-utils/traverse';
import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { SyncBlockProduct } from '../common/types';

import { createResourceIdForReference, parseResourceId } from './resourceId';

/*
 * Rewrites `syncBlock`/`bodiedSyncBlock` identifiers so a document stays internally
 * consistent after cloud-to-cloud migration or a copy to different host content.
 *
 * Source nodes (`bodiedSyncBlock`) carry a bare UUID as both `resourceId` and `localId` -
 * the host content ID never appears in the ADF, only in the block ARI, which Block
 * Service derives from the cloud ID and parent content ID at runtime. Reference nodes
 * (`syncBlock`) carry `{product}/{contentId}/{sourceUuid}`. So preserving the UUID (the
 * default) needs no edit on source nodes, and only remaps the `contentId` segment on
 * references - which also keeps re-runs idempotent.
 */

export type SyncBlockIdResolvers = {
	/** Return `undefined` for an unknown content ID - it's left untouched and reported via `unresolvedContentIds`. */
	resolveContentId: (contentId: string, product: SyncBlockProduct) => string | undefined;

	/** Omit to preserve UUIDs (recommended). Return `undefined` to preserve one UUID while remapping others. */
	resolveUuid?: (uuid: string) => string | undefined;
};

export type SyncBlockIdMigrationResult = {
	isTransformed: boolean;
	transformedAdf: ADFEntity;
	/** Reference content IDs with no mapping - a signal to investigate, not necessarily a failure. */
	unresolvedContentIds: string[];
};

type SyncBlockNodeAttrs = { localId?: string; resourceId: string };

/** Bails to `undefined` on anything that isn't a syncBlock/bodiedSyncBlock attrs shape. */
const parseSyncBlockAttrs = (attrs: Record<string, unknown>): SyncBlockNodeAttrs | undefined => {
	const { resourceId, localId } = attrs;
	if (typeof resourceId !== 'string' || resourceId === '') {
		return undefined;
	}

	return { resourceId, localId: typeof localId === 'string' ? localId : undefined };
};

const migrateAttrs = (
	attrs: SyncBlockNodeAttrs,
	resolvers: SyncBlockIdResolvers,
	unresolvedContentIds: Set<string>,
): { localId?: string; resourceId: string } | undefined => {
	const { resourceId, localId } = attrs;
	const parsed = parseResourceId(resourceId);

	if (parsed) {
		const mappedContentId = resolvers.resolveContentId(parsed.contentId, parsed.product);
		if (mappedContentId === undefined) {
			unresolvedContentIds.add(parsed.contentId);
		}

		const nextContentId = mappedContentId ?? parsed.contentId;
		const nextUuid = resolvers.resolveUuid?.(parsed.uuid) ?? parsed.uuid;

		if (nextContentId === parsed.contentId && nextUuid === parsed.uuid) {
			return undefined;
		}

		return {
			resourceId: createResourceIdForReference(parsed.product, nextContentId, nextUuid),
			// Only mirror the UUID when this node's localId tracked it in the first place.
			localId: localId === parsed.uuid ? nextUuid : localId,
		};
	}

	// bare-UUID source node: no content ID segment to remap
	const nextUuid = resolvers.resolveUuid?.(resourceId);
	if (nextUuid === undefined || nextUuid === resourceId) {
		return undefined;
	}

	return {
		resourceId: nextUuid,
		localId: localId === resourceId ? nextUuid : localId,
	};
};

/** `isTransformed` is `false` when no node changed, so callers can skip persisting the result. */
export const migrateSyncBlockIds = (
	adf: ADFEntity,
	resolvers: SyncBlockIdResolvers,
): SyncBlockIdMigrationResult => {
	const unresolvedContentIds = new Set<string>();
	let isTransformed = false;

	// Always returns a copy, even when nothing changes: traverse() falls back to mutating
	// the original node in place (its `content` array gets reassigned) whenever a visitor
	// returns undefined, so returning undefined here would leak that mutation onto the
	// caller's input document.
	const migrateNode = (node: ADFEntity): ADFEntity => {
		const syncBlockAttrs = node.attrs && parseSyncBlockAttrs(node.attrs);
		if (!syncBlockAttrs) {
			return { ...node };
		}

		const nextAttrs = migrateAttrs(syncBlockAttrs, resolvers, unresolvedContentIds);
		if (!nextAttrs) {
			return { ...node };
		}

		isTransformed = true;
		return {
			...node,
			attrs: {
				...node.attrs,
				...nextAttrs,
			},
		};
	};

	const transformedAdf = traverse(adf, {
		syncBlock: migrateNode,
		bodiedSyncBlock: migrateNode,
	});

	// traverse() only returns false when a visitor deletes the root node; migrateNode never does.
	if (transformedAdf === false) {
		throw new Error('migrateSyncBlockIds: traverse unexpectedly removed the root node');
	}

	return {
		transformedAdf,
		isTransformed,
		unresolvedContentIds: Array.from(unresolvedContentIds),
	};
};

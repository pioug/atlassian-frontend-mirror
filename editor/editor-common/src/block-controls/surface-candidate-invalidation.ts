import type { Transaction } from '@atlaskit/editor-prosemirror/state';

/** Transaction metadata for contributors whose surface visibility changes without editing the document. */
export const BLOCK_CONTROLS_SURFACE_INVALIDATION = 'blockControlsSurfaceInvalidation';

export type BlockControlsSurfaceInvalidation = {
	/** Match local IDs against retained candidates, without searching the document. */
	ids?: readonly string[];
	positions?: readonly number[];
	ranges?: readonly { from: number; to: number }[];
};

/**
 * Temporary shared helper for merging invalidations from independent contributors.
 *
 * This would ideally be owned by the Block Controls plugin, but Block Collapse also emits
 * invalidations while Block Controls depends on it for collapsed-heading drag and move behavior.
 * Moving this helper into Block Controls would therefore create a package dependency cycle.
 * Keep it in editor-common until that dependency can be inverted or removed.
 */
export const invalidateBlockControlsSurfaces = (
	tr: Transaction,
	invalidation: BlockControlsSurfaceInvalidation,
): Transaction => {
	const previous: BlockControlsSurfaceInvalidation | undefined = tr.getMeta(
		BLOCK_CONTROLS_SURFACE_INVALIDATION,
	);
	return tr.setMeta(BLOCK_CONTROLS_SURFACE_INVALIDATION, {
		ids: [...(previous?.ids ?? []), ...(invalidation.ids ?? [])],
		positions: [...(previous?.positions ?? []), ...(invalidation.positions ?? [])],
		ranges: [...(previous?.ranges ?? []), ...(invalidation.ranges ?? [])],
	} satisfies BlockControlsSurfaceInvalidation);
};

import type { BlockControlsSurfaceInvalidation } from '@atlaskit/editor-common/block-controls/surface-candidate-invalidation';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import { mapSparseSurfaceCandidates } from './sparse-surface-candidates';
import type { SparseSurfacesState } from './sparse-surfaces-state';

export type PendingSparseSurfacesState = Pick<SparseSurfacesState, 'invalidation'>;

const mergeInvalidation = ({
	current,
	incoming,
	tr,
}: {
	current: BlockControlsSurfaceInvalidation | undefined;
	incoming: BlockControlsSurfaceInvalidation | undefined;
	tr: ReadonlyTransaction;
}): BlockControlsSurfaceInvalidation | undefined => {
	if (!current && !incoming) {
		return undefined;
	}
	if (!incoming && !tr.docChanged) {
		return current;
	}
	const ids = [...(current?.ids ?? []), ...(incoming?.ids ?? [])];
	const positions = [
		...(current?.positions ?? []).map((position) => tr.mapping.map(position, 1)),
		...(incoming?.positions ?? []),
	];
	const ranges = [
		...(current?.ranges ?? []).map(({ from, to }) => ({
			from: tr.mapping.map(from, -1),
			to: tr.mapping.map(to, 1),
		})),
		...(incoming?.ranges ?? []),
	];
	return ids.length || positions.length || ranges.length ? { ids, positions, ranges } : undefined;
};

const mapAnchors = (
	anchors: ReadonlyMap<number, string>,
	tr: ReadonlyTransaction,
): ReadonlyMap<number, string> => {
	if (!tr.docChanged || anchors.size === 0) {
		return anchors;
	}
	let changed = false;
	const mappedAnchors = new Map<number, string>();
	for (const [position, name] of anchors) {
		const mapped = tr.mapping.mapResult(position, 1);
		if (!mapped.deleted) {
			mappedAnchors.set(mapped.pos, name);
			changed ||= mapped.pos !== position;
		} else {
			changed = true;
		}
	}
	return changed ? mappedAnchors : anchors;
};

export const reducePendingState = ({
	invalidation,
	previous,
	tr,
}: {
	invalidation: BlockControlsSurfaceInvalidation | undefined;
	previous: SparseSurfacesState;
	tr: ReadonlyTransaction;
}): PendingSparseSurfacesState => ({
	invalidation: mergeInvalidation({
		current: previous.invalidation,
		incoming: invalidation,
		tr,
	}),
});

export const isUnchangedTransaction = ({
	pending,
	previous,
	tr,
}: {
	pending: PendingSparseSurfacesState;
	previous: SparseSurfacesState;
	tr: ReadonlyTransaction;
}): boolean => !tr.docChanged && pending.invalidation === previous.invalidation;

export const mapTransactionState = ({
	newState,
	pending,
	previous,
	tr,
}: {
	newState: EditorState;
	pending: PendingSparseSurfacesState;
	previous: SparseSurfacesState;
	tr: ReadonlyTransaction;
}): SparseSurfacesState => ({
	...previous,
	anchors: mapAnchors(previous.anchors, tr),
	candidates: tr.docChanged
		? mapSparseSurfaceCandidates({
				newState,
				previousState: previous.candidates,
				tr,
			})
		: previous.candidates,
	decorations: tr.docChanged ? previous.decorations.map(tr.mapping, tr.doc) : previous.decorations,
	documentChanged: previous.documentChanged || tr.docChanged,
	invalidation: pending.invalidation,
});

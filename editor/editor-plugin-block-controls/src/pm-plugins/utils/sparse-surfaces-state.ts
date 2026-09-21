import type { BlockControlsSurfaceInvalidation } from '@atlaskit/editor-common/block-controls/surface-candidate-invalidation';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { ActiveNode } from '../../blockControlsPluginType';
import type { SparseSurfaceCandidateState } from './sparse-surface-candidates';
import {
	isUnchangedTransaction,
	mapTransactionState,
	reducePendingState,
} from './sparse-surfaces-mapping';

export type SparseSurfacesState = {
	activeNodesByPosition: ReadonlyMap<number, ActiveNode>;
	anchors: ReadonlyMap<number, string>;
	candidates: SparseSurfaceCandidateState;
	decorations: DecorationSet;
	documentChanged: boolean;
	invalidation?: BlockControlsSurfaceInvalidation;
};

export type SparseSurfacesReconciliation = Pick<
	SparseSurfacesState,
	'activeNodesByPosition' | 'anchors' | 'candidates' | 'decorations'
>;

export type SparseSurfacesMeta = {
	reconciliation: SparseSurfacesReconciliation;
	type: 'commitReconciliation';
};

export const createInitialSparseSurfacesState = (
	candidates: SparseSurfaceCandidateState,
): SparseSurfacesState => ({
	activeNodesByPosition: new Map(),
	anchors: new Map(),
	candidates,
	decorations: DecorationSet.empty,
	documentChanged: false,
});

export type ApplySparseSurfacesTransactionInput = {
	invalidation: BlockControlsSurfaceInvalidation | undefined;
	meta: SparseSurfacesMeta | undefined;
	newState: EditorState;
	previous: SparseSurfacesState;
	tr: ReadonlyTransaction;
};

type ReconciliationMeta = Extract<SparseSurfacesMeta, { type: 'commitReconciliation' }>;

const isReconciliationCommit = (meta: SparseSurfacesMeta | undefined): meta is ReconciliationMeta =>
	meta?.type === 'commitReconciliation';

const commitReconciliation = (
	previous: SparseSurfacesState,
	meta: ReconciliationMeta,
): SparseSurfacesState => ({
	...previous,
	...meta.reconciliation,
	documentChanged: false,
	invalidation: undefined,
});

export const applySparseSurfacesTransaction = (
	input: ApplySparseSurfacesTransactionInput,
): SparseSurfacesState => {
	if (isReconciliationCommit(input.meta)) {
		return commitReconciliation(input.previous, input.meta);
	}

	const pending = reducePendingState({
		invalidation: input.invalidation,
		previous: input.previous,
		tr: input.tr,
	});
	if (isUnchangedTransaction({ pending, previous: input.previous, tr: input.tr })) {
		return input.previous;
	}

	return mapTransactionState({
		newState: input.newState,
		pending,
		previous: input.previous,
		tr: input.tr,
	});
};

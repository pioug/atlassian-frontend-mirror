import { BLOCK_CONTROL_UI_CONTEXT } from '@atlaskit/editor-common/block-controls/block-control-ui-context';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { createSurfaceContext } from '@atlaskit/editor-ui-control-model/create-surface-context';
import { willComponentRender } from '@atlaskit/editor-ui-control-model/surface-renderer';
import type { ResolvedSurface } from '@atlaskit/editor-ui-control-model/surface-renderer/types';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import type { ActiveNode } from '../../blockControlsPluginType';
import { createBlockControlsSurfaceContextForPosition } from '../../ui/block-controls-surface-context';
import { hasSurfaceControls } from '../../ui/utils/has-surface-controls';

export type SparseCandidateRange = {
	from: number;
	to: number;
};

export type SparseCandidateInvalidation = {
	all?: boolean;
	ids?: readonly string[];
	positions?: readonly number[];
	ranges?: readonly SparseCandidateRange[];
};

/**
 * Viewport positions are post-transaction positions supplied by the DOM observer. The reducer
 * never needs to inspect DOM or search document IDs for viewport discovery.
 */
export type SparseCandidateMeta = {
	/** Menu/root targets may carry context distinct from global hover activeNode; map changes invalidate positions. */
	activeNodesByPosition?: ReadonlyMap<number, ActiveNode>;
	changedRange?: SparseCandidateRange;
	/** Set by view reconciliation when mapping and predicate evaluation are split. */
	documentChanged?: boolean;
	/** Registry changes must use `invalidation: { all: true }`. */
	invalidation?: SparseCandidateInvalidation;
	/** Complete current set; pass [] when menu/hover protection ends. */
	protectedPositions?: readonly number[];
	/** Property presence is significant: `visiblePositions: []` clears visible candidates. */
	visiblePositions?: readonly number[];
};

export type SparseSurfaceCandidate = {
	contextRevision: string;
	/** Optional stable node id, used only when matching cached invalidations. */
	id?: string;
	/** Persistent controls keep their candidate and DOM anchor outside the viewport. */
	isPersistent: boolean;
	/** PM structural sharing lets reconcile detect changed cached nodes cheaply. */
	nodeRef: object;
	nodeSize: number;
	nodeType: string;
	pos: number;
	/** False entries stay cached, so hidden nodes are not re-preflighted on re-entry. */
	renders: boolean;
};

export type SparseSurfaceCandidateState = {
	activeRevision: string;
	candidates: ReadonlyMap<number, SparseSurfaceCandidate>;
	positions: readonly number[];
	protectedPositions: readonly number[];
	visiblePositions: readonly number[];
};

export type SparseSurfaceCandidateInput = {
	activeNode?: ActiveNode | null;
	meta?: SparseCandidateMeta;
	newState: EditorState;
	previousState: SparseSurfaceCandidateState;
	resolvedSurfaces: readonly ResolvedSurface[];
	tr: Transaction;
};

const NO_ACTIVE = 'none';
const EMPTY_CANDIDATES: ReadonlyMap<number, SparseSurfaceCandidate> = new Map();
const EMPTY_POSITIONS: readonly number[] = [];
const EMPTY_PROTECTED_POSITIONS: readonly number[] = [];

export const emptySparseSurfaceCandidateState: SparseSurfaceCandidateState = {
	activeRevision: NO_ACTIVE,
	candidates: EMPTY_CANDIDATES,
	positions: EMPTY_POSITIONS,
	protectedPositions: EMPTY_PROTECTED_POSITIONS,
	visiblePositions: EMPTY_POSITIONS,
};

const getActiveRevision = (activeNode: ActiveNode | null | undefined): string =>
	activeNode
		? [
				activeNode.pos,
				activeNode.nodeType,
				activeNode.rootPos ?? activeNode.pos,
				activeNode.rootNodeType ?? '',
			].join(':')
		: NO_ACTIVE;

const isInRange = (position: number, range: SparseCandidateRange): boolean =>
	position >= range.from && position <= range.to;

const normalizeRange = (
	range: SparseCandidateRange,
	contentSize: number,
): SparseCandidateRange => ({
	from: Math.max(0, Math.min(contentSize, Math.min(range.from, range.to))),
	to: Math.max(0, Math.min(contentSize, Math.max(range.from, range.to))),
});

const getSurfaces = (
	resolvedSurfaces: readonly ResolvedSurface[],
): readonly { childrenMap: ResolvedSurface['childrenMap']; root: RegisterComponent }[] =>
	resolvedSurfaces.flatMap(({ childrenMap, components, root }) =>
		root && hasSurfaceControls(components) ? [{ childrenMap, root }] : [],
	);

const getNodeId = (node: { attrs?: Record<string, unknown> }): string | undefined => {
	const localId = node.attrs?.localId;
	return typeof localId === 'string' ? localId : undefined;
};

const sameCandidate = (
	first: SparseSurfaceCandidate | undefined,
	second: SparseSurfaceCandidate | undefined,
): boolean =>
	first?.id === second?.id &&
	first?.contextRevision === second?.contextRevision &&
	first?.isPersistent === second?.isPersistent &&
	first?.nodeRef === second?.nodeRef &&
	first?.nodeType === second?.nodeType &&
	first?.nodeSize === second?.nodeSize &&
	first?.pos === second?.pos &&
	first?.renders === second?.renders;

const sameCandidateMap = (
	first: ReadonlyMap<number, SparseSurfaceCandidate>,
	second: ReadonlyMap<number, SparseSurfaceCandidate>,
): boolean => {
	if (first.size !== second.size) {
		return false;
	}
	for (const [position, candidate] of first) {
		if (!sameCandidate(candidate, second.get(position))) {
			return false;
		}
	}
	return true;
};

const samePositions = (first: readonly number[], second: readonly number[]): boolean =>
	first.length === second.length && first.every((position, index) => position === second[index]);

const normalizePositions = (positions: readonly number[]): readonly number[] =>
	Array.from(new Set(positions)).sort((first, second) => first - second);

const mapPositions = (
	positions: readonly number[],
	tr: Pick<ReadonlyTransaction, 'docChanged' | 'mapping'>,
): readonly number[] =>
	normalizePositions(
		positions
			.map((position) =>
				tr.docChanged ? tr.mapping.mapResult(position, 1) : { deleted: false, pos: position },
			)
			.filter((result) => !result.deleted)
			.map((result) => result.pos),
	);

const createSurfaceContextAtPosition = (
	state: EditorState,
	position: number,
	activeNode: ActiveNode | undefined,
) => {
	const blockControlsContext = createBlockControlsSurfaceContextForPosition(
		state,
		position,
		activeNode,
	);
	return blockControlsContext
		? createSurfaceContext(BLOCK_CONTROL_UI_CONTEXT, blockControlsContext)
		: undefined;
};

const willAnySurfaceRenderAt = (
	surfaces: readonly { childrenMap: ResolvedSurface['childrenMap']; root: RegisterComponent }[],
	state: EditorState,
	position: number,
	activeNode: ActiveNode | undefined,
): boolean => {
	const surfaceContext = createSurfaceContextAtPosition(state, position, activeNode);
	return surfaces.some(({ childrenMap, root }) =>
		willComponentRender(root, childrenMap, surfaceContext),
	);
};

const addCandidateAt = ({
	candidates,
	position,
	state,
	surfaces,
	activeNode,
}: {
	activeNode: ActiveNode | undefined;
	candidates: Map<number, SparseSurfaceCandidate>;
	position: number;
	state: EditorState;
	surfaces: readonly { childrenMap: ResolvedSurface['childrenMap']; root: RegisterComponent }[];
}): void => {
	const node = state.doc.nodeAt(position);
	if (!node?.isBlock) {
		candidates.delete(position);
		return;
	}
	const isPersistent = willAnySurfaceRenderAt(surfaces, state, position, undefined);
	const renders =
		isPersistent ||
		(activeNode !== undefined && willAnySurfaceRenderAt(surfaces, state, position, activeNode));
	candidates.set(position, {
		contextRevision: getActiveRevision(activeNode),
		id: getNodeId(node),
		isPersistent,
		nodeRef: node,
		nodeType: node.type.name,
		nodeSize: node.nodeSize,
		renders,
		pos: position,
	});
};

const isInvalidated = (
	candidate: SparseSurfaceCandidate,
	position: number,
	invalidation: SparseCandidateInvalidation | undefined,
	changedRange: SparseCandidateRange | undefined,
): boolean => {
	if (invalidation?.all) {
		return true;
	}
	if (invalidation?.ids?.some((id) => id === candidate.id)) {
		return true;
	}
	if (invalidation?.positions?.includes(position)) {
		return true;
	}
	return Boolean(
		(changedRange && isInRange(position, changedRange)) ||
		invalidation?.ranges?.some((range) => isInRange(position, range)),
	);
};

const getPositions = (candidates: ReadonlyMap<number, SparseSurfaceCandidate>): readonly number[] =>
	Array.from(candidates.values())
		.filter((candidate) => candidate.renders)
		.map((candidate) => candidate.pos)
		.sort((first, second) => first - second);

const mapCandidates = (
	state: SparseSurfaceCandidateState,
	tr: Transaction,
	retain: (position: number, candidate: SparseSurfaceCandidate) => boolean,
): Map<number, SparseSurfaceCandidate> => {
	const mapped = new Map<number, SparseSurfaceCandidate>();
	for (const candidate of state.candidates.values()) {
		const result = tr.docChanged
			? tr.mapping.mapResult(candidate.pos, 1)
			: { deleted: false, pos: candidate.pos };
		if (!result.deleted && retain(result.pos, candidate)) {
			mapped.set(
				result.pos,
				result.pos === candidate.pos ? candidate : { ...candidate, pos: result.pos },
			);
		}
	}
	return mapped;
};

export type MapSparseSurfaceCandidatesInput = {
	newState: EditorState;
	previousState: SparseSurfaceCandidateState;
	tr: Transaction | ReadonlyTransaction;
};

/** Map cache state during PM apply. This phase never calls isHidden or scans doc. */
export const mapSparseSurfaceCandidates = ({
	newState,
	previousState,
	tr,
}: MapSparseSurfaceCandidatesInput): SparseSurfaceCandidateState => {
	if (!tr.docChanged) {
		return previousState;
	}

	const candidates = new Map<number, SparseSurfaceCandidate>();
	for (const candidate of previousState.candidates.values()) {
		const result = tr.mapping.mapResult(candidate.pos, 1);
		if (!result.deleted) {
			candidates.set(
				result.pos,
				result.pos === candidate.pos ? candidate : { ...candidate, pos: result.pos },
			);
		}
	}
	const protectedPositions = normalizePositions(
		previousState.protectedPositions
			.map((position) => tr.mapping.mapResult(position, 1))
			.filter((result) => !result.deleted)
			.map((result) => result.pos),
	);
	const visiblePositions = mapPositions(previousState.visiblePositions, tr);
	const positions = getPositions(candidates);
	const candidatesUnchanged = sameCandidateMap(previousState.candidates, candidates);
	const positionsUnchanged = samePositions(previousState.positions, positions);
	const protectedUnchanged = samePositions(previousState.protectedPositions, protectedPositions);
	if (
		candidatesUnchanged &&
		positionsUnchanged &&
		protectedUnchanged &&
		samePositions(previousState.visiblePositions, visiblePositions)
	) {
		return previousState;
	}

	return {
		...previousState,
		candidates: candidatesUnchanged ? previousState.candidates : candidates,
		positions: positionsUnchanged ? previousState.positions : positions,
		protectedPositions: protectedUnchanged ? previousState.protectedPositions : protectedPositions,
		visiblePositions,
	};
};

export type ReconcileSparseSurfaceCandidatesInput = {
	activeNode?: ActiveNode | null;
	activeNodesByPosition?: ReadonlyMap<number, ActiveNode>;
	changedRange?: SparseCandidateRange;
	documentChanged?: boolean;
	invalidation?: SparseCandidateInvalidation;
	newState: EditorState;
	protectedPositions?: readonly number[];
	resolvedSurfaces: readonly ResolvedSurface[];
	state: SparseSurfaceCandidateState;
	visiblePositions?: readonly number[];
};

/**
 * Reconcile after view state is current. Predicate work stays bounded to cache,
 * exact visible positions, explicit ranges, and protected active/menu positions.
 */
export const reconcileSparseSurfaceCandidates = ({
	activeNodesByPosition,
	activeNode,
	changedRange,
	documentChanged = false,
	invalidation,
	newState,
	protectedPositions,
	resolvedSurfaces,
	state,
	visiblePositions,
}: ReconcileSparseSurfaceCandidatesInput): SparseSurfaceCandidateState =>
	reduceSparseSurfaceCandidates({
		activeNode,
		meta: {
			activeNodesByPosition,
			changedRange,
			documentChanged,
			invalidation,
			protectedPositions,
			visiblePositions,
		},
		newState,
		previousState: state,
		resolvedSurfaces,
		tr: newState.tr,
	});

/**
 * Update sparse candidates. Viewport and invalidation metadata are the only
 * discovery inputs; active changes re-evaluate retained cache, never document.
 */
export const reduceSparseSurfaceCandidates = ({
	activeNode,
	meta,
	newState,
	previousState,
	resolvedSurfaces,
	tr,
}: SparseSurfaceCandidateInput): SparseSurfaceCandidateState => {
	const activeRevision = getActiveRevision(activeNode);
	const activeChanged = activeRevision !== previousState.activeRevision;
	const hasVisiblePositionsUpdate = Boolean(
		meta && Object.prototype.hasOwnProperty.call(meta, 'visiblePositions'),
	);
	const visiblePositions = hasVisiblePositionsUpdate
		? normalizePositions(meta?.visiblePositions ?? EMPTY_POSITIONS)
		: tr.docChanged
			? mapPositions(previousState.visiblePositions, tr)
			: previousState.visiblePositions;
	const visiblePositionsChanged = !samePositions(visiblePositions, previousState.visiblePositions);
	const requestedProtectedPositions = normalizePositions(
		meta?.protectedPositions ?? previousState.protectedPositions,
	);
	const protectedPositions = samePositions(
		previousState.protectedPositions,
		requestedProtectedPositions,
	)
		? previousState.protectedPositions
		: requestedProtectedPositions;
	const protectedSet = new Set(protectedPositions);
	if (activeNode) {
		protectedSet.add(activeNode.pos);
		protectedSet.add(activeNode.rootPos ?? activeNode.pos);
	}

	const visibleSet = new Set(visiblePositions);
	const retain = (position: number, candidate?: SparseSurfaceCandidate): boolean =>
		(candidate?.isPersistent || protectedSet.has(position) || visibleSet.has(position)) &&
		position >= 0 &&
		position <= newState.doc.content.size;
	const surfaces = getSurfaces(resolvedSurfaces);
	const activeNodeAt = (position: number): ActiveNode | undefined =>
		meta?.activeNodesByPosition?.get(position) ?? activeNode ?? undefined;
	const changedRange = meta?.changedRange
		? normalizeRange(meta.changedRange, newState.doc.content.size)
		: undefined;
	const invalidation = meta?.invalidation;
	const documentChanged = meta?.documentChanged ?? tr.docChanged;
	const previousCandidates = mapCandidates(previousState, tr, retain);
	const dirty = (candidate: SparseSurfaceCandidate, position: number): boolean => {
		const currentNode = newState.doc.nodeAt(position);
		const currentContextRevision = getActiveRevision(activeNodeAt(position));
		return (
			activeChanged ||
			candidate.contextRevision !== currentContextRevision ||
			candidate.nodeRef !== currentNode ||
			isInvalidated(candidate, position, invalidation, changedRange)
		);
	};

	if (surfaces.length === 0) {
		const noCandidates = previousCandidates.size === 0;
		if (
			noCandidates &&
			previousState.positions.length === 0 &&
			samePositions(visiblePositions, previousState.visiblePositions) &&
			activeRevision === previousState.activeRevision &&
			protectedPositions === previousState.protectedPositions
		) {
			return previousState;
		}
		return {
			activeRevision,
			candidates: noCandidates ? previousState.candidates : EMPTY_CANDIDATES,
			positions: EMPTY_POSITIONS,
			protectedPositions,
			visiblePositions,
		};
	}

	for (const [position, candidate] of previousCandidates) {
		if (dirty(candidate, position)) {
			addCandidateAt({
				candidates: previousCandidates,
				position,
				state: newState,
				surfaces,
				activeNode: activeNodeAt(position),
			});
			const updatedCandidate = previousCandidates.get(position);
			if (updatedCandidate && !retain(position, updatedCandidate)) {
				previousCandidates.delete(position);
			}
		}
	}

	// IO supplies exact visible positions. Iterate those positions directly so a long visible
	// container cannot cause a traversal of its entire nested document.
	if (visiblePositionsChanged || documentChanged || invalidation?.all || changedRange) {
		for (const position of visiblePositions) {
			if (!previousCandidates.has(position)) {
				addCandidateAt({
					candidates: previousCandidates,
					position,
					state: newState,
					surfaces,
					activeNode: activeNodeAt(position),
				});
			}
		}
	}

	const directPositions = new Set([...protectedSet, ...(invalidation?.positions ?? [])]);
	for (const position of directPositions) {
		if (retain(position) && !previousCandidates.has(position)) {
			addCandidateAt({
				candidates: previousCandidates,
				position,
				state: newState,
				surfaces,
				activeNode: activeNodeAt(position),
			});
		}
	}

	const positions = getPositions(previousCandidates);
	if (
		sameCandidateMap(previousState.candidates, previousCandidates) &&
		samePositions(previousState.positions, positions) &&
		samePositions(previousState.visiblePositions, visiblePositions) &&
		activeRevision === previousState.activeRevision &&
		protectedPositions === previousState.protectedPositions
	) {
		return previousState;
	}

	return {
		activeRevision,
		candidates: sameCandidateMap(previousState.candidates, previousCandidates)
			? previousState.candidates
			: previousCandidates,
		positions: samePositions(previousState.positions, positions)
			? previousState.positions
			: positions,
		protectedPositions,
		visiblePositions,
	};
};

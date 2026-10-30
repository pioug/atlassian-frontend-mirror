import {
	BLOCK_CONTROLS_LEFT_SURFACE,
	BLOCK_CONTROLS_RIGHT_SURFACE,
} from '@atlaskit/editor-common/block-controls/surface-keys';
import { getNodeIdProvider } from '@atlaskit/editor-common/node-anchor-provider';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';
import { resolveSurface } from '@atlaskit/editor-ui-control-model/surface-renderer';

import type {
	ActiveNode,
	BlockControlsPlugin,
	PluginState as BlockControlsState,
} from '../blockControlsPluginType';
import {
	createSurfaceAnchorDecorations,
	TYPE_SURFACE_ANCHOR_DEC,
} from '../pm-plugins/decorations-surface-anchor';
import { key as blockControlsKey } from '../pm-plugins/main';
import { bindSparseGutterHover } from '../pm-plugins/sparse-gutter-hover';
import {
	reconcileSparseSurfaceCandidates,
	type SparseSurfaceCandidateState,
} from '../pm-plugins/utils/sparse-surface-candidates';
import type {
	SparseSurfacesMeta,
	SparseSurfacesState,
} from '../pm-plugins/utils/sparse-surfaces-state';
import {
	observeSurfaceViewport,
	type SurfaceViewportPositions,
} from '../pm-plugins/utils/surface-viewport';
import { getBlockControlsSurfaceTargets } from '../ui/block-controls-surface-targets';
import { createSurfaceDescriptorResolver } from './block-controls-surface-descriptors';
import {
	getSurfaceLifecycle,
	type SurfaceLifecycle,
	type SurfaceSnapshot,
} from './surface-lifecycle';

type Api = ExtractInjectionAPI<BlockControlsPlugin> | undefined;

type SparseSurfacesPluginView = {
	destroy: () => void;
	update: (view: EditorView, previousState: EditorState) => void;
};

type DescriptorResolver = ReturnType<typeof createSurfaceDescriptorResolver>;

const haveAnchorPositionsChanged = (
	positions: readonly number[],
	anchors: ReadonlyMap<number, string>,
): boolean =>
	positions.length !== anchors.size || positions.some((position) => !anchors.has(position));

const areAnchorsEqual = (a: ReadonlyMap<number, string>, b: ReadonlyMap<number, string>): boolean =>
	a.size === b.size && [...a].every(([position, name]) => b.get(position) === name);

/** Limited mode and dragging remove every sparse anchor decoration from the document. */
const areSurfacesSuppressed = (api: Api, state: EditorState): boolean =>
	Boolean(
		api?.limitedMode?.sharedState.currentState()?.enabled ||
		blockControlsKey.getState(state)?.isDragging,
	);

/** An open block menu keeps its trigger node, and that node's root, as active surface positions. */
const getMenuActiveNodes = (
	controls: BlockControlsState | undefined,
	doc: PMNode,
): Map<number, ActiveNode> => {
	const activeNodesByPosition = new Map<number, ActiveNode>();
	const menu = controls?.isMenuOpen ? controls.menuTriggerByNode : undefined;
	if (menu && controls?.menuTriggerBy && doc.nodeAt(menu.pos)) {
		const menuNode: ActiveNode = { ...menu, anchorName: controls.menuTriggerBy };
		activeNodesByPosition.set(menu.pos, menuNode);
		activeNodesByPosition.set(menu.rootPos ?? menu.pos, menuNode);
	}
	return activeNodesByPosition;
};

const reconcileCandidates = ({
	activeNode,
	activeNodesByPosition,
	api,
	previous,
	registryChanged,
	state,
	visiblePositions,
}: {
	activeNode: ActiveNode | undefined;
	activeNodesByPosition: ReadonlyMap<number, ActiveNode>;
	api: Api;
	previous: SparseSurfacesState;
	registryChanged: boolean;
	state: EditorState;
	visiblePositions: SurfaceViewportPositions;
}): SparseSurfaceCandidateState =>
	reconcileSparseSurfaceCandidates({
		activeNode,
		activeNodesByPosition,
		newState: state,
		state: previous.candidates,
		visiblePositions,
		protectedPositions: [...activeNodesByPosition.keys()],
		resolvedSurfaces: [BLOCK_CONTROLS_LEFT_SURFACE, BLOCK_CONTROLS_RIGHT_SURFACE].map((surface) =>
			resolveSurface(api?.uiControlRegistry?.actions.getComponents(surface) ?? [], surface),
		),
		documentChanged: previous.documentChanged,
		invalidation: { ...previous.invalidation, all: registryChanged },
	});

/** True when the committed state already matches the candidates and no anchor awaits retirement. */
const isReconciled = (
	previous: SparseSurfacesState,
	candidates: SparseSurfaceCandidateState,
	lifecycle: SurfaceLifecycle,
): boolean =>
	!haveAnchorPositionsChanged(candidates.positions, previous.anchors) &&
	candidates === previous.candidates &&
	!previous.documentChanged &&
	!previous.invalidation &&
	!lifecycle.hasRetirableAnchors(previous.decorations);

/**
 * Builds anchor decorations for the candidate positions, keeping each node's existing anchor name
 * and any anchor a committed or pending surface still uses.
 */
const createReconciledDecorations = (
	view: EditorView,
	previous: SparseSurfacesState,
	positions: readonly number[],
	lifecycle: SurfaceLifecycle,
): { anchors: ReadonlyMap<number, string>; decorations: DecorationSet } => {
	const previousAnchors = new Map(
		previous.decorations
			.find(undefined, undefined, (spec) => spec.type === TYPE_SURFACE_ANCHOR_DEC)
			.map((decoration) => [decoration.from, String(decoration.spec.anchorName)]),
	);
	const nodeIdProvider = getNodeIdProvider(view);
	const { anchors: nextAnchors, decorations: desiredDecorations } = createSurfaceAnchorDecorations(
		view.state,
		positions,
		(node, position, previousAnchorName) => {
			if (previousAnchorName) {
				nodeIdProvider.setIdForNode(node, previousAnchorName);
				return previousAnchorName;
			}
			return nodeIdProvider.getOrGenerateId(node, position);
		},
		previousAnchors,
	);
	return {
		// Retiring anchors after a commit leaves the anchor map unchanged, so keep its identity.
		anchors: areAnchorsEqual(nextAnchors, previous.anchors) ? previous.anchors : nextAnchors,
		decorations: lifecycle.retainAnchors(view.state.doc, desiredDecorations, previous.decorations),
	};
};

const resolveSurfaceSnapshot = ({
	activeNode,
	activeNodesByPosition,
	anchors,
	api,
	invalidated,
	positions,
	resolvers,
	state,
}: {
	activeNode: ActiveNode | undefined;
	activeNodesByPosition: ReadonlyMap<number, ActiveNode>;
	anchors: ReadonlyMap<number, string>;
	api: Api;
	invalidated: boolean;
	positions: readonly number[];
	resolvers: { left: DescriptorResolver; right: DescriptorResolver };
	state: EditorState;
}): Omit<SurfaceSnapshot, 'revision'> => {
	const candidatePositions = new Set(positions);
	const input = {
		activeNode,
		state,
		surfaceActiveNodes: activeNodesByPosition,
		surfaceAnchors: anchors,
		targets: getBlockControlsSurfaceTargets(activeNode, positions).filter(({ position }) =>
			candidatePositions.has(position),
		),
	};
	return {
		forceVisibleOnMouseOut: Boolean(activeNode?.handleOptions?.isFocused),
		left: resolvers.left(
			{
				...input,
				components:
					api?.uiControlRegistry?.actions.getComponents(BLOCK_CONTROLS_LEFT_SURFACE) ?? [],
			},
			invalidated,
		),
		right: resolvers.right(
			{
				...input,
				components:
					api?.uiControlRegistry?.actions.getComponents(BLOCK_CONTROLS_RIGHT_SURFACE) ?? [],
			},
			invalidated,
		),
	};
};

/** Changes that can add or remove anchor suppression, which also invalidates control visibility. */
const haveSuppressionInputsChanged = (
	controls: BlockControlsState | undefined,
	previousControls: BlockControlsState | undefined,
): boolean =>
	controls?.isDragging !== previousControls?.isDragging ||
	controls?.isResizerResizing !== previousControls?.isResizerResizing;

/** Changes that can move surfaces between blocks without invalidating control visibility. */
const haveSurfaceInputsChanged = (
	sparse: SparseSurfacesState | undefined,
	controls: BlockControlsState | undefined,
	previousControls: BlockControlsState | undefined,
): boolean =>
	Boolean(sparse?.documentChanged || sparse?.invalidation) ||
	controls?.activeNode !== previousControls?.activeNode ||
	controls?.isMenuOpen !== previousControls?.isMenuOpen ||
	controls?.menuTriggerByNode !== previousControls?.menuTriggerByNode;

const subscribeToInvalidation = (api: Api, invalidate: () => void): (() => void) => {
	const unsubscribers = [
		api?.uiControlRegistry?.actions.subscribe(invalidate),
		api?.editorDisabled?.sharedState.onChange(invalidate),
		api?.editorViewMode?.sharedState.onChange(invalidate),
		api?.limitedMode?.sharedState.onChange(invalidate),
		api?.showDiff?.sharedState.onChange(invalidate),
		api?.userIntent?.sharedState.onChange(invalidate),
	];
	return () => unsubscribers.forEach((unsubscribe) => unsubscribe?.());
};

/**
 * Sparse surfaces plugin view for the CLS fix. Each animation frame reconciles which blocks have
 * surfaces, commits their anchor decorations, and publishes the surfaces React renders through
 * `SurfaceLifecycle`, which retains anchors until React commits their replacement.
 */
export const createSparseSurfacesViewWithLifecycle = ({
	api,
	pluginKey,
	view,
}: {
	api: Api;
	pluginKey: PluginKey<SparseSurfacesState>;
	view: EditorView;
}): SparseSurfacesPluginView => {
	const win = view.dom.ownerDocument.defaultView;
	const lifecycle = getSurfaceLifecycle(view);
	const resolvers = {
		left: createSurfaceDescriptorResolver('left'),
		right: createSurfaceDescriptorResolver('right'),
	};
	let frame: number | undefined;
	let visiblePositions: SurfaceViewportPositions = [];
	let registryChanged = true;
	let surfaceStateChanged = false;

	const updateAvailableAnchors = () => {
		const sparse = pluginKey.getState(view.state);
		if (sparse) {
			lifecycle.updateAnchors(sparse.decorations, areSurfacesSuppressed(api, view.state));
		}
	};

	const reconcile = () => {
		frame = undefined;
		const previous = pluginKey.getState(view.state);
		if (!previous || api?.limitedMode?.sharedState.currentState()?.enabled) {
			return;
		}
		const controls = blockControlsKey.getState(view.state);
		const activeNode = controls?.activeNode;
		const activeNodesByPosition = getMenuActiveNodes(controls, view.state.doc);
		const candidates = reconcileCandidates({
			activeNode,
			activeNodesByPosition,
			api,
			previous,
			registryChanged,
			state: view.state,
			visiblePositions,
		});
		const visibilityChanged = registryChanged;
		registryChanged = false;
		if (
			!surfaceStateChanged &&
			!visibilityChanged &&
			isReconciled(previous, candidates, lifecycle)
		) {
			return;
		}
		surfaceStateChanged = false;

		const { anchors, decorations } = createReconciledDecorations(
			view,
			previous,
			candidates.positions,
			lifecycle,
		);
		view.dispatch(
			view.state.tr.setMeta(pluginKey, {
				reconciliation: { activeNodesByPosition, anchors, candidates, decorations },
				type: 'commitReconciliation',
			} satisfies SparseSurfacesMeta),
		);
		lifecycle.publish(
			resolveSurfaceSnapshot({
				activeNode,
				activeNodesByPosition,
				anchors,
				api,
				invalidated: visibilityChanged || Boolean(previous.invalidation),
				positions: candidates.positions,
				resolvers,
				state: view.state,
			}),
			anchors,
		);
	};

	const schedule = () => {
		if (frame === undefined && win) {
			frame = win.requestAnimationFrame(reconcile);
		}
	};
	const invalidate = () => {
		if (areSurfacesSuppressed(api, view.state)) {
			updateAvailableAnchors();
		}
		registryChanged = true;
		schedule();
	};

	updateAvailableAnchors();
	// A committed tree may no longer need older anchors; the next reconcile retires them.
	lifecycle.setOnCommit(schedule);
	const observer = observeSurfaceViewport(view, (positions) => {
		visiblePositions = positions;
		schedule();
	});
	const unsubscribe = subscribeToInvalidation(api, invalidate);
	const unbindGutterHover = bindSparseGutterHover({ api, view });

	return {
		update(currentView: EditorView, previousState: EditorState): void {
			updateAvailableAnchors();
			observer.update();
			const controls = blockControlsKey.getState(currentView.state);
			const previousControls = blockControlsKey.getState(previousState);
			if (haveSuppressionInputsChanged(controls, previousControls)) {
				invalidate();
			}
			if (
				haveSurfaceInputsChanged(pluginKey.getState(currentView.state), controls, previousControls)
			) {
				surfaceStateChanged = true;
				schedule();
			}
		},
		destroy(): void {
			if (frame !== undefined) {
				win?.cancelAnimationFrame(frame);
			}
			lifecycle.destroy();
			observer.destroy();
			unbindGutterHover?.();
			unsubscribe();
		},
	};
};

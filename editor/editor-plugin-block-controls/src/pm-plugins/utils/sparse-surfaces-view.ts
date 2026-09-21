import {
	BLOCK_CONTROLS_LEFT_SURFACE,
	BLOCK_CONTROLS_RIGHT_SURFACE,
} from '@atlaskit/editor-common/block-controls/surface-keys';
import { getNodeIdProvider } from '@atlaskit/editor-common/node-anchor';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { resolveSurface } from '@atlaskit/editor-ui-control-model/surface-renderer';

import type { ActiveNode, BlockControlsPlugin } from '../../blockControlsPluginType';
import { createSurfaceAnchorDecorations } from '../decorations-surface-anchor';
import { key as blockControlsKey } from '../main';
import { reconcileSparseSurfaceCandidates } from './sparse-surface-candidates';
import type { SparseSurfacesMeta, SparseSurfacesState } from './sparse-surfaces-state';
import { observeSurfaceViewport, type SurfaceViewportPositions } from './surface-viewport';

type SparseSurfacesPluginView = {
	destroy: () => void;
	update: (view: EditorView, previousState: EditorState) => void;
};

const haveAnchorPositionsChanged = (
	positions: readonly number[],
	anchors: ReadonlyMap<number, string>,
): boolean =>
	positions.length !== anchors.size || positions.some((position) => !anchors.has(position));

export const createSparseSurfacesView = ({
	api,
	pluginKey,
	view,
}: {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	pluginKey: PluginKey<SparseSurfacesState>;
	view: EditorView;
}): SparseSurfacesPluginView => {
	const win = view.dom.ownerDocument.defaultView;
	let frame: number | undefined;
	let visiblePositions: SurfaceViewportPositions = [];
	let registryChanged = true;

	const reconcile = () => {
		frame = undefined;
		const previous = pluginKey.getState(view.state);
		if (!previous || api?.limitedMode?.sharedState.currentState()?.enabled) {
			return;
		}

		const controls = blockControlsKey.getState(view.state);
		const activeNode = controls?.activeNode;
		const activeNodesByPosition = new Map<number, ActiveNode>();
		const menu = controls?.isMenuOpen ? controls.menuTriggerByNode : undefined;
		if (menu && controls?.menuTriggerBy && view.state.doc.nodeAt(menu.pos)) {
			const menuNode: ActiveNode = { ...menu, anchorName: controls.menuTriggerBy };
			activeNodesByPosition.set(menu.pos, menuNode);
			activeNodesByPosition.set(menu.rootPos ?? menu.pos, menuNode);
		}

		const resolvedSurfaces = [BLOCK_CONTROLS_LEFT_SURFACE, BLOCK_CONTROLS_RIGHT_SURFACE].map(
			(surface) =>
				resolveSurface(api?.uiControlRegistry?.actions.getComponents(surface) ?? [], surface),
		);
		const candidates = reconcileSparseSurfaceCandidates({
			activeNode,
			activeNodesByPosition,
			newState: view.state,
			state: previous.candidates,
			visiblePositions,
			protectedPositions: [...activeNodesByPosition.keys()],
			resolvedSurfaces,
			documentChanged: previous.documentChanged,
			invalidation: { ...previous.invalidation, all: registryChanged },
		});
		const visibilityChanged = registryChanged;
		registryChanged = false;
		const anchorPositions = candidates.positions;
		if (
			!visibilityChanged &&
			!haveAnchorPositionsChanged(anchorPositions, previous.anchors) &&
			candidates === previous.candidates &&
			!previous.documentChanged &&
			!previous.invalidation
		) {
			return;
		}

		const nodeIdProvider = getNodeIdProvider(view);
		const { anchors, decorations } = createSurfaceAnchorDecorations(
			view.state,
			anchorPositions,
			(node, position, previousAnchorName) => {
				if (previousAnchorName) {
					nodeIdProvider.setIdForNode(node, previousAnchorName);
					return previousAnchorName;
				}
				return nodeIdProvider.getOrGenerateId(node, position);
			},
			previous.anchors,
		);
		view.dispatch(
			view.state.tr.setMeta(pluginKey, {
				reconciliation: {
					activeNodesByPosition,
					anchors,
					candidates,
					decorations,
				},
				type: 'commitReconciliation',
			} satisfies SparseSurfacesMeta),
		);
	};

	const schedule = () => {
		if (frame === undefined && win) {
			frame = win.requestAnimationFrame(reconcile);
		}
	};
	const observer = observeSurfaceViewport(view, (positions) => {
		visiblePositions = positions;
		schedule();
	});
	const invalidate = () => {
		registryChanged = true;
		schedule();
	};
	const unsubscribe = api?.uiControlRegistry?.actions.subscribe(invalidate);
	const unsubscribers = [
		api?.editorDisabled?.sharedState.onChange(invalidate),
		api?.editorViewMode?.sharedState.onChange(invalidate),
		api?.limitedMode?.sharedState.onChange(invalidate),
		api?.showDiff?.sharedState.onChange(invalidate),
		api?.userIntent?.sharedState.onChange(invalidate),
	];

	return {
		update(currentView: EditorView, previousState: EditorState): void {
			observer.update();
			const sparse = pluginKey.getState(currentView.state);
			const controls = blockControlsKey.getState(currentView.state);
			const previousControls = blockControlsKey.getState(previousState);
			if (
				controls?.isDragging !== previousControls?.isDragging ||
				controls?.isResizerResizing !== previousControls?.isResizerResizing
			) {
				invalidate();
			}
			if (
				sparse?.documentChanged ||
				sparse?.invalidation ||
				controls?.activeNode !== previousControls?.activeNode ||
				controls?.isMenuOpen !== previousControls?.isMenuOpen ||
				controls?.menuTriggerByNode !== previousControls?.menuTriggerByNode
			) {
				schedule();
			}
		},
		destroy(): void {
			if (frame !== undefined) {
				win?.cancelAnimationFrame(frame);
			}
			observer.destroy();
			unsubscribe?.();
			unsubscribers.forEach((unsubscribe) => unsubscribe?.());
		},
	};
};

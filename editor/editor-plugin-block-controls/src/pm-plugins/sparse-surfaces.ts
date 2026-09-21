import {
	BLOCK_CONTROLS_SURFACE_INVALIDATION,
	type BlockControlsSurfaceInvalidation,
} from '@atlaskit/editor-common/block-controls/surface-candidate-invalidation';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState, ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { key as blockControlsKey } from './main';
import { emptySparseSurfaceCandidateState } from './utils/sparse-surface-candidates';
import {
	applySparseSurfacesTransaction,
	createInitialSparseSurfacesState,
	type SparseSurfacesMeta,
	type SparseSurfacesState,
} from './utils/sparse-surfaces-state';
import { createSparseSurfacesView } from './utils/sparse-surfaces-view';

export const sparseSurfacesKey: PluginKey<SparseSurfacesState> = new PluginKey<SparseSurfacesState>(
	'blockControlsSparseSurfaces',
);

/** Owns sparse anchors independently of drag/drop decorations and their lifecycle. */
export const createSparseSurfacesPlugin = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
): SafePlugin<SparseSurfacesState> =>
	new SafePlugin<SparseSurfacesState>({
		key: sparseSurfacesKey,
		state: {
			init: () => createInitialSparseSurfacesState(emptySparseSurfaceCandidateState),
			apply(
				tr: ReadonlyTransaction,
				previous: SparseSurfacesState,
				_oldState: EditorState,
				newState: EditorState,
			) {
				return applySparseSurfacesTransaction({
					invalidation: tr.getMeta(BLOCK_CONTROLS_SURFACE_INVALIDATION) as
						| BlockControlsSurfaceInvalidation
						| undefined,
					meta: tr.getMeta(sparseSurfacesKey) as SparseSurfacesMeta | undefined,
					newState,
					previous,
					tr,
				});
			},
		},
		props: {
			decorations(state: EditorState) {
				return api?.limitedMode?.sharedState.currentState()?.enabled ||
					blockControlsKey.getState(state)?.isDragging
					? DecorationSet.empty
					: sparseSurfacesKey.getState(state)?.decorations;
			},
		},
		view: (view: EditorView) =>
			createSparseSurfacesView({ api, pluginKey: sparseSurfacesKey, view }),
	});

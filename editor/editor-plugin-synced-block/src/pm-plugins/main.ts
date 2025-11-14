import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import {
	BodiedSyncBlockSharedCssClassName,
	SyncBlockStateCssClassName,
} from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet, Decoration, type EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import { lazyBodiedSyncBlockView } from '../nodeviews/bodiedLazySyncedBlock';
import { lazySyncBlockView } from '../nodeviews/lazySyncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { FLAG_ID } from '../types';

import { shouldIgnoreDomEvent } from './utils/ignore-dom-event';
import { calculateDecorations } from './utils/selection-decorations';
import { hasEditInSyncBlock, trackSyncBlocks } from './utils/track-sync-blocks';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

type SyncedBlockPluginState = {
	selectionDecorationSet: DecorationSet;
	showFlag: FLAG_ID | false;
};

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => {
	const { useLongPressSelection = false } = options || {};

	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init(_, instance: EditorState): SyncedBlockPluginState {
				const syncBlockNodes = instance.doc.children.filter(
					(node) => node.type.name === 'syncBlock',
				);
				syncBlockStore.fetchSyncBlocksData(syncBlockNodes);
				return {
					selectionDecorationSet: calculateDecorations(
						instance.doc,
						instance.selection,
						instance.schema,
					),
					showFlag: false,
				};
			},
			apply: (tr, currentPluginState, oldEditorState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);

				const { showFlag, selectionDecorationSet } = currentPluginState;

				let newDecorationSet = selectionDecorationSet.map(tr.mapping, tr.doc);
				if (!tr.selection.eq(oldEditorState.selection)) {
					newDecorationSet = calculateDecorations(tr.doc, tr.selection, tr.doc.type.schema);
				}
				return {
					showFlag: meta?.showFlag ?? showFlag,
					selectionDecorationSet: newDecorationSet,
				};
			},
		},
		props: {
			nodeViews: {
				syncBlock: lazySyncBlockView({
					options,
					pmPluginFactoryParams,
					api,
					syncBlockStore,
				}),
				bodiedSyncBlock: lazyBodiedSyncBlockView({
					pluginOptions: options,
					pmPluginFactoryParams,
					api,
					syncBlockStore,
				}),
			},
			decorations: (state) => {
				const selectionDecorationSet: DecorationSet =
					syncedBlockPluginKey.getState(state)?.selectionDecorationSet ?? DecorationSet.empty;
				const { doc } = state;
				const decorations: Decoration[] = [];
				if (api?.connectivity?.sharedState.currentState()?.mode === 'offline') {
					state.doc.descendants((node, pos) => {
						if (node.type.name === 'bodiedSyncBlock') {
							decorations.push(
								Decoration.node(pos, pos + node.nodeSize, {
									class: SyncBlockStateCssClassName.disabledClassName,
								}),
							);
						}
					});
				}

				return selectionDecorationSet.add(doc, decorations);
			},
			handleClickOn: createSelectionClickHandler(
				['bodiedSyncBlock'],
				(target) => !!target.closest(`.${BodiedSyncBlockSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
			handleDOMEvents: {
				mouseover(view, event) {
					return shouldIgnoreDomEvent(view, event, api);
				},
				mousedown(view, event) {
					return shouldIgnoreDomEvent(view, event, api);
				},
			},
		},
		view: (editorView: EditorView) => {
			syncBlockStore.setEditorView(editorView);

			return {
				destroy() {
					syncBlockStore.setEditorView(undefined);
				},
			};
		},
		filterTransaction: (tr, state) => {
			const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
			const isConfirmedSyncBlockDeletion = Boolean(tr.getMeta('isConfirmedSyncBlockDeletion'));
			// Ignore transactions that don't change the document
			// or are from remote (collab) or already confirmed sync block deletion
			// We only care about local changes that change the document
			// and are not yet confirmed for sync block deletion
			if (
				!tr.docChanged ||
				(!syncBlockStore?.requireConfirmationBeforeDelete() &&
					!syncBlockStore.hasPendingCreation()) ||
				Boolean(tr.getMeta('isRemote')) ||
				Boolean(tr.getMeta('isCommitSyncBlockCreation')) ||
				(!isOffline && isConfirmedSyncBlockDeletion)
			) {
				return true;
			}

			const { removed, added } = trackSyncBlocks(syncBlockStore, tr, state);

			if (!isOffline) {
				if (removed.length > 0) {
					// If there are source sync blocks being removed, and we need to confirm with user before deleting,
					// we block the transaction here, and wait for user confirmation to proceed with deletion.
					// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
					// proceed with deletion.
					syncBlockStore.deleteSyncBlocksWithConfirmation(tr, removed);

					return false;
				}

				if (added.length > 0) {
					// If there is bodiedSyncBlock node addition and it's waiting for the result of saving the node to backend (syncBlockStore.hasPendingCreation()),
					// we need to intercept the transaction and save it in insert callback so that we only insert it to the document when backend call if backend call is successful
					// The callback will be evoked by in SourceSyncBlockStoreManager.commitPendingCreation
					syncBlockStore.registerCreationCallback(() => {
						api?.core?.actions.execute(() => {
							return tr.setMeta('isCommitSyncBlockCreation', true);
						});
						api?.core.actions.focus();
					});

					return false;
				}
			} else {
				// Disable node deletion/creation/edition in offline mode and trigger an error flag instead
				let errorFlag: FLAG_ID | false = false;
				if (isConfirmedSyncBlockDeletion || removed.length > 0) {
					errorFlag = FLAG_ID.CANNOT_DELETE_WHEN_OFFLINE;
				} else if (added.length > 0) {
					errorFlag = FLAG_ID.CANNOT_CREATE_WHEN_OFFLINE;
				} else if (hasEditInSyncBlock(tr, state)) {
					errorFlag = FLAG_ID.CANNOT_EDIT_WHEN_OFFLINE;
				}

				if (errorFlag) {
					api?.core.actions.execute(({ tr }) => {
						tr.setMeta(syncedBlockPluginKey, {
							showFlag: errorFlag,
						});

						return tr;
					});
					return false;
				}
			}

			return true;
		},
		appendTransaction: (trs, _oldState, newState) => {
			trs
				.filter((tr) => tr.docChanged)
				.forEach((tr) => {
					syncBlockStore?.rebaseTransaction(tr, newState);
				});

			return null;
		},
	});
};

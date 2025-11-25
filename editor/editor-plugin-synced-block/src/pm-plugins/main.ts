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
import {
	convertPMNodesToSyncBlockNodes,
	type SyncBlockStoreManager,
} from '@atlaskit/editor-synced-block-provider';

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
	syncBlockStore: SyncBlockStoreManager;
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
			// @ts-ignore - Workaround for help-center local consumption
			init(_, instance: EditorState): SyncedBlockPluginState {
				const syncBlockNodes = instance.doc.children.filter(
					(node) => node.type.name === 'syncBlock',
				);
				syncBlockStore.referenceManager.fetchSyncBlocksData(
					convertPMNodesToSyncBlockNodes(syncBlockNodes),
				);
				return {
					selectionDecorationSet: calculateDecorations(
						instance.doc,
						instance.selection,
						instance.schema,
					),
					showFlag: false,
					syncBlockStore: syncBlockStore,
				};
			},
			// @ts-ignore - Workaround for help-center local consumption
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
					syncBlockStore: syncBlockStore,
				};
			},
		},
		props: {
			nodeViews: {
				syncBlock: lazySyncBlockView({
					options,
					pmPluginFactoryParams,
					api,
				}),
				bodiedSyncBlock: lazyBodiedSyncBlockView({
					pluginOptions: options,
					pmPluginFactoryParams,
					api,
				}),
			},
			// @ts-ignore - Workaround for help-center local consumption
			decorations: (state) => {
				const selectionDecorationSet: DecorationSet =
					syncedBlockPluginKey.getState(state)?.selectionDecorationSet ?? DecorationSet.empty;
				const { doc } = state;

				const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
				const isViewMode = api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

				const offlineDecorations: Decoration[] = [];
				const viewModeDecorations: Decoration[] = [];

				// @ts-ignore - Workaround for help-center local consumption
				state.doc.descendants((node, pos) => {
					if (node.type.name === 'bodiedSyncBlock' && isOffline) {
						offlineDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.disabledClassName,
							}),
						);
					}

					if (
						(node.type.name === 'bodiedSyncBlock' || node.type.name === 'syncBlock') &&
						isViewMode
					) {
						viewModeDecorations.push(
							Decoration.node(pos, pos + node.nodeSize, {
								class: SyncBlockStateCssClassName.viewModeClassName,
							}),
						);
					}
				});

				return selectionDecorationSet.add(doc, offlineDecorations).add(doc, viewModeDecorations);
			},
			handleClickOn: createSelectionClickHandler(
				['bodiedSyncBlock'],
				(target) => !!target.closest(`.${BodiedSyncBlockSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
			handleDOMEvents: {
				// @ts-ignore - Workaround for help-center local consumption
				mouseover(view, event) {
					return shouldIgnoreDomEvent(view, event, api);
				},
				// @ts-ignore - Workaround for help-center local consumption
				mousedown(view, event) {
					return shouldIgnoreDomEvent(view, event, api);
				},
			},
		},
		view: (editorView: EditorView) => {
			syncBlockStore.sourceManager.setEditorView(editorView);

			return {
				destroy() {
					syncBlockStore.sourceManager.setEditorView(undefined);
				},
			};
		},
		// @ts-ignore - Workaround for help-center local consumption
		filterTransaction: (tr, state) => {
			const isOffline = api?.connectivity?.sharedState.currentState()?.mode === 'offline';
			const isConfirmedSyncBlockDeletion = Boolean(tr.getMeta('isConfirmedSyncBlockDeletion'));
			// Ignore transactions that don't change the document
			// or are from remote (collab) or already confirmed sync block deletion
			// We only care about local changes that change the document
			// and are not yet confirmed for sync block deletion
			if (
				!tr.docChanged ||
				(!syncBlockStore?.sourceManager.requireConfirmationBeforeDelete() &&
					!syncBlockStore.sourceManager.hasPendingCreation()) ||
				Boolean(tr.getMeta('isRemote')) ||
				Boolean(tr.getMeta('isCommitSyncBlockCreation')) ||
				(!isOffline && isConfirmedSyncBlockDeletion)
			) {
				return true;
			}

			const { removed: bodiedSyncBlockRemoved, added: bodiedSyncBlockAdded } = trackSyncBlocks(
				syncBlockStore.sourceManager.isSourceBlock,
				tr,
				state,
			);

			if (!isOffline) {
				if (bodiedSyncBlockRemoved.length > 0) {
					// If there are source sync blocks being removed, and we need to confirm with user before deleting,
					// we block the transaction here, and wait for user confirmation to proceed with deletion.
					// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
					// proceed with deletion.
					syncBlockStore.sourceManager.deleteSyncBlocksWithConfirmation(tr, bodiedSyncBlockRemoved);

					return false;
				}

				if (bodiedSyncBlockAdded.length > 0) {
					// If there is bodiedSyncBlock node addition and it's waiting for the result of saving the node to backend (syncBlockStore.hasPendingCreation()),
					// we need to intercept the transaction and save it in insert callback so that we only insert it to the document when backend call if backend call is successful
					// The callback will be evoked by in SourceSyncBlockStoreManager.commitPendingCreation
					syncBlockStore.sourceManager.registerCreationCallback(() => {
						api?.core?.actions.execute(() => {
							return tr.setMeta('isCommitSyncBlockCreation', true);
						});
						api?.core.actions.focus();
					});

					return false;
				}
			} else {
				// Disable (bodied)syncBlock node deletion/creation/edition in offline mode and trigger an error flag instead
				const { removed: syncBlockRemoved, added: syncBlockAdded } = trackSyncBlocks(
					(node) => node.type.name === 'syncBlock',
					tr,
					state,
				);
				let errorFlag: FLAG_ID | false = false;
				if (
					isConfirmedSyncBlockDeletion ||
					bodiedSyncBlockRemoved.length > 0 ||
					syncBlockRemoved.length > 0
				) {
					errorFlag = FLAG_ID.CANNOT_DELETE_WHEN_OFFLINE;
				} else if (bodiedSyncBlockAdded.length > 0 || syncBlockAdded.length > 0) {
					errorFlag = FLAG_ID.CANNOT_CREATE_WHEN_OFFLINE;
				} else if (hasEditInSyncBlock(tr, state)) {
					errorFlag = FLAG_ID.CANNOT_EDIT_WHEN_OFFLINE;
				}

				if (errorFlag) {
					// Use setTimeout to dispatch transaction in next tick and avoid re-entrant dispatch
					setTimeout(() => {
						api?.core.actions.execute(({ tr }) => {
							return tr.setMeta(syncedBlockPluginKey, {
								showFlag: errorFlag,
							});
						});
					}, 0);
					return false;
				}
			}

			return true;
		},
		// @ts-ignore - Workaround for help-center local consumption
		appendTransaction: (trs, _oldState, newState) => {
			trs
				// @ts-ignore - Workaround for help-center local consumption
				.filter((tr) => tr.docChanged)
				// @ts-ignore - Workaround for help-center local consumption
				.forEach((tr) => {
					syncBlockStore?.sourceManager.rebaseTransaction(tr, newState);
				});

			return null;
		},
	});
};

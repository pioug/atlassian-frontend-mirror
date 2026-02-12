import { bind } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DRAG_HANDLE_SELECTOR } from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	type EditorState,
	type ReadonlyTransaction,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockControlsPlugin } from '../../blockControlsPluginType';
import { key } from '../main';
import { createPreservedSelection, mapPreservedSelection } from '../utils/selection';

import { stopPreservingSelection } from './editor-commands';
import { selectionPreservationPluginKey } from './plugin-key';
import type { SelectionPreservationPluginState } from './types';
import {
	compareSelections,
	getSelectionPreservationMeta,
	hasUserSelectionChange,
	syncDOMSelection,
} from './utils';

/**
 * Selection Preservation Plugin
 *
 * Used to ensure the selection remains stable across selected nodes during specific UI operations,
 * such as when block menus are open or during drag-and-drop actions.
 *
 * We use a TextSelection to span multi-node selections, however there is a ProseMirror limitation
 * where TextSelection cannot include non inline positions at node boundaries (like media/images).
 *
 * When a selection spans text + media nodes, subsequent transactions cause ProseMirror to collapse
 * the selection to the nearest inline position, excluding the media node. This is problematic for
 * features like block menus and drag-and-drop that need stable multi-node selections while performing
 * operations.
 *
 * The plugin works in three phases:
 * (1) Explicitly save a selection via startPreservingSelection() when opening block menus or starting drag operations.
 * (2) Map the saved selection through document changes to keep positions valid.
 * (3) Detect when transactions collapse the selection and restore it via appendTransaction().
 *
 * Stops preserving via stopPreservingSelection() when the menu closes or operation completes.
 *
 * Commands: startPreservingSelection() to begin preservation, stopPreservingSelection() to end it.
 *
 * NOTE: Only use when the UI blocks user selection changes. For example: when a block menu overlay
 * is open (editor becomes non-interactive), during drag-and-drop operations (user is mid-drag), or
 * when modal dialogs are active. In these states, any selection changes are from ProseMirror's
 * internal behavior (not user input) and should be prevented. Do not use during normal editing.
 *
 * https://hello.atlassian.net/wiki/spaces/egcuc/pages/6170822503/Block+Menu+Solution+for+multi-select+and+selection+preservation
 */
export const createSelectionPreservationPlugin =
	(api?: ExtractInjectionAPI<BlockControlsPlugin>) => () => {
		return new SafePlugin<SelectionPreservationPluginState>({
			key: selectionPreservationPluginKey,
			state: {
				init() {
					return {
						preservedSelection: undefined,
					};
				},

				apply(tr: ReadonlyTransaction, pluginState: SelectionPreservationPluginState) {
					const meta = getSelectionPreservationMeta(tr);

					const newState = { ...pluginState };

					if (meta?.type === 'startPreserving') {
						newState.preservedSelection = createPreservedSelection(
							tr.doc.resolve(tr.selection.from),
							tr.doc.resolve(tr.selection.to),
						);
					} else if (meta?.type === 'stopPreserving') {
						newState.preservedSelection = undefined;
					} else if (newState.preservedSelection && tr.docChanged) {
						newState.preservedSelection = mapPreservedSelection(newState.preservedSelection, tr);
					}

					if (!compareSelections(newState.preservedSelection, pluginState.preservedSelection)) {
						if (newState.preservedSelection) {
							api?.core.actions.execute(
								api?.selection?.commands?.setBlockSelection(newState.preservedSelection),
							);
						} else {
							api?.core.actions.execute(api?.selection?.commands?.clearBlockSelection());
						}
					}

					return newState;
				},
			},

			appendTransaction(
				transactions: readonly Transaction[],
				_oldState: EditorState,
				newState: EditorState,
			) {
				const pluginState = selectionPreservationPluginKey.getState(newState);
				const preservedSel = pluginState?.preservedSelection;
				const stateSel = newState.selection;

				if (!preservedSel) {
					return null;
				}

				// Auto-stop if user explicitly changes selection
				if (hasUserSelectionChange(transactions)) {
					return stopPreservingSelection({ tr: newState.tr });
				}

				const selectionUnchanged =
					stateSel.from === preservedSel.from && stateSel.to === preservedSel.to;
				const selectionInvalid =
					preservedSel.from < 0 || preservedSel.to > newState.doc.content.size;

				if (selectionUnchanged || selectionInvalid) {
					return null;
				}

				const newSelection = createPreservedSelection(
					newState.doc.resolve(preservedSel.from),
					newState.doc.resolve(preservedSel.to),
				);

				// If selection becomes invalid, stop preserving
				if (!newSelection) {
					return stopPreservingSelection({ tr: newState.tr });
				}

				return newState.tr.setSelection(newSelection);
			},

			view(initialView: EditorView) {
				let view: EditorView = initialView;
				const doc = getDocument();

				if (!doc) {
					return {
						update() {},
						destroy() {},
					};
				}

				const unbindDocumentMouseDown = bind(doc, {
					type: 'mousedown',
					listener: (e) => {
						if (!(e.target instanceof HTMLElement)) {
							return;
						}

						const { preservedSelection } =
							selectionPreservationPluginKey.getState(view.state) || {};

						// If there is no current preserved selection or the editor is not focused, do nothing
						if (!preservedSelection) {
							return;
						}

						const clickedDragHandle = !!e.target.closest(DRAG_HANDLE_SELECTOR);

						// When mouse down on a drag handle we continue preserving the selection
						if (clickedDragHandle) {
							return;
						}

						const clickedOutsideEditor = !e.target.closest('.ProseMirror');

						// When mouse down outside the editor continue to preserve the selection
						if (clickedOutsideEditor) {
							return;
						}

						// Otherwise mouse down anywhere else in the editor stops preserving the selection
						const tr = view.state.tr;
						stopPreservingSelection({ tr });
						view.dispatch(tr);
					},
					// Use capture phase to stop preservation before appendTransaction runs,
					// preventing unwanted selection restoration when the user clicks into the editor.
					options: { capture: true },
				});

				return {
					update(updateView: EditorView, prevState: EditorState) {
						view = updateView;

						// [FEATURE FLAG: platform_editor_selection_sync_fix]
						// When enabled, syncs DOM selection even when editor doesn't have focus.
						// This prevents ghost highlighting after moving nodes when block menu is open.
						// To clean up: remove the if-else block and keep only the flag-on behavior.
						if (fg('platform_editor_selection_sync_fix')) {
							const prevPreservedSelection =
								selectionPreservationPluginKey.getState(prevState)?.preservedSelection;
							const currPreservedSelection = selectionPreservationPluginKey.getState(
								view.state,
							)?.preservedSelection;
							const prevActiveNode = key.getState(prevState)?.activeNode;
							const currActiveNode = key.getState(view.state)?.activeNode;

							// Sync DOM selection when the preserved selection or active node changes
							// AND the document has changed (e.g., nodes moved)
							// This prevents stealing focus during menu navigation while still fixing ghost highlighting
							const hasPreservedSelection = !!currPreservedSelection;
							const preservedSelectionChanged = !compareSelections(
								prevPreservedSelection,
								currPreservedSelection,
							);
							const activeNodeChanged = prevActiveNode !== currActiveNode;
							const docChanged = prevState.doc !== view.state.doc;
							const shouldSyncDOMSelection =
								hasPreservedSelection &&
								(preservedSelectionChanged || activeNodeChanged) &&
								docChanged;

							if (shouldSyncDOMSelection) {
								syncDOMSelection(view.state.selection, view);
							}
						} else {
							// OLD BEHAVIOR (to be removed when flag is cleaned up)
							// Only synced when editor had focus, causing ghost highlighting issues
							const prevPreservedSelection =
								selectionPreservationPluginKey.getState(prevState)?.preservedSelection;
							const currPreservedSelection = selectionPreservationPluginKey.getState(
								view.state,
							)?.preservedSelection;
							const prevActiveNode = key.getState(prevState)?.activeNode;
							const currActiveNode = key.getState(view.state)?.activeNode;

							if (
								currPreservedSelection &&
								view.hasFocus() &&
								(!compareSelections(prevPreservedSelection, currPreservedSelection) ||
									prevActiveNode !== currActiveNode)
							) {
								// Old syncDOMSelection signature (to be removed)
								syncDOMSelection(view.state.selection);
							}
						}
					},
					destroy() {
						unbindDocumentMouseDown();
					},
				};
			},

			props: {
				handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
					const { preservedSelection } = selectionPreservationPluginKey.getState(view.state) || {};

					// If there is no current preserved selection, do nothing
					if (!preservedSelection) {
						return false;
					}

					api?.core?.actions.execute(
						api?.blockControls?.commands?.handleKeyDownWithPreservedSelection(event),
					);

					// While preserving selection, if user presses delete/backspace, prevent event from being
					// handled by ProseMirror natively so that we can apply logic using the preserved selection.
					return ['backspace', 'delete'].includes(event.key.toLowerCase());
				},
			},
		});
	};

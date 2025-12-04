import { logException } from '@atlaskit/editor-common/monitoring';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
	type EditorState,
	type ReadonlyTransaction,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';

import { mapPreservedSelection } from '../utils/selection';

import { stopPreservingSelection } from './editor-commands';
import { selectionPreservationPluginKey } from './plugin-key';
import type { SelectionPreservationPluginState } from './types';
import { getSelectionPreservationMeta, hasUserSelectionChange } from './utils';

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
 */
export const createSelectionPreservationPlugin = () => {
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
					newState.preservedSelection = tr.selection;
				} else if (meta?.type === 'stopPreserving') {
					newState.preservedSelection = undefined;
				}

				if (newState.preservedSelection && tr.docChanged) {
					newState.preservedSelection = mapPreservedSelection(newState.preservedSelection, tr);
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
			const savedSel = pluginState?.preservedSelection;

			if (!savedSel) {
				return null;
			}

			if (hasUserSelectionChange(transactions)) {
				// Auto-stop if user explicitly changes selection
				return stopPreservingSelection({ tr: newState.tr });
			}

			const currSel = newState.selection;

			const selectionUnchanged = currSel.from === savedSel.from && currSel.to === savedSel.to;
			const selectionInvalid = savedSel.from < 0 || savedSel.to > newState.doc.content.size;

			if (selectionUnchanged || selectionInvalid) {
				return null;
			}

			try {
				return newState.tr.setSelection(savedSel);
			} catch (error) {
				logException(error as Error, {
					location: 'editor-plugin-block-controls/SelectionPreservationPlugin',
				});
			}

			return null;
		},
	});
};

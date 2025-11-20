import { logException } from '@atlaskit/editor-common/monitoring';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	type ReadonlyTransaction,
	TextSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';

import { stopPreservingSelection } from './editor-commands';
import { selectionPreservationPluginKey } from './plugin-key';
import type { SelectionPreservationPluginState } from './types';
import { getSelectionPreservationMeta, hasUserSelectionChange } from './utils';

/**
 * Selection Preservation Plugin for ProseMirror Editor
 *
 * Solves a ProseMirror limitation where TextSelection cannot include positions at node boundaries
 * (like media/images). When a selection spans text + media nodes, subsequent transactions cause
 * ProseMirror to collapse the selection to the nearest inline position, excluding the media node.
 * This is problematic for features like block menus and drag-and-drop that need stable multi-node
 * selections while performing operations.
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
					newState.preservedSelection = new TextSelection(tr.selection.$from, tr.selection.$to);
				} else if (meta?.type === 'stopPreserving') {
					newState.preservedSelection = undefined;
				}

				if (newState.preservedSelection && tr.docChanged) {
					const from = tr.mapping.map(newState.preservedSelection.from);
					const to = tr.mapping.map(newState.preservedSelection.to);

					if (from < 0 || to > tr.doc.content.size || from >= to) {
						// stop preserving if preserved selection becomes invalid or collapsed to a cursor
						// e.g. after deleting the selection
						newState.preservedSelection = undefined;
					} else {
						const { $from, $to } = expandToBlockRange(tr.doc.resolve(from), tr.doc.resolve(to));

						newState.preservedSelection = new TextSelection($from, $to);
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
			const savedSel = pluginState?.preservedSelection;

			if (!savedSel) {
				return null;
			}

			if (hasUserSelectionChange(transactions)) {
				// Auto-stop if user explicitly changes selection
				return stopPreservingSelection({ tr: newState.tr });
			}

			const currSel = newState.selection;

			const wasEmptySelection = savedSel.from === savedSel.to;
			const selectionUnchanged = currSel.from === savedSel.from && currSel.to === savedSel.to;
			const selectionInvalid = savedSel.from < 0 || savedSel.to > newState.doc.content.size;
			if (wasEmptySelection || selectionUnchanged || selectionInvalid) {
				return null;
			}

			try {
				return newState.tr.setSelection(
					TextSelection.create(newState.doc, savedSel.from, savedSel.to),
				);
			} catch (error) {
				logException(error as Error, {
					location: 'editor-plugin-block-controls/SelectionPreservationPlugin',
				});
			}

			return null;
		},
	});
};

const expandToBlockRange = ($from: ResolvedPos, $to: ResolvedPos) => {
	const range = $from.blockRange($to);

	if (!range) {
		return { $from, $to };
	}

	return {
		$from: $from.doc.resolve(range.start),
		$to: $to.doc.resolve(range.end),
	};
};

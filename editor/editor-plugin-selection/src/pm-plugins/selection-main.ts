import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { SelectionPluginState } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { SelectionPlugin } from '../selectionPluginType';
import type { SelectionPluginOptions } from '../types';
import { selectionPluginKey } from '../types';

import { SelectionActionTypes } from './actions';
import { onCreateSelectionBetween } from './events/create-selection-between';
import { createOnKeydown } from './events/keydown';
import { onMouseOut } from './events/mouseout';
import { createPluginState, getPluginState } from './plugin-factory';
import { getDecorations, shouldRecalcDecorations } from './utils';

export const getInitialState = (state: EditorState): SelectionPluginState => ({
	decorationSet: getDecorations(state.tr),
	selection: state.selection,
});

export const createPlugin = (
	api: ExtractInjectionAPI<SelectionPlugin> | undefined,
	dispatch: Dispatch,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	options: SelectionPluginOptions = {},
) => {
	let cursorHidden = false;

	return new SafePlugin({
		key: selectionPluginKey,
		state: createPluginState(dispatch, getInitialState),
		appendTransaction(transactions, oldEditorState, newEditorState) {
			const { tr } = newEditorState;

			let manualSelection: { anchor: number; head: number } | undefined;
			let hideCursorChanged = false;

			const needsHideCursor = fg('platform_editor_ai_aifc_patch_beta');
			const needsManualSelection = editorExperiment(
				'platform_editor_element_drag_and_drop_multiselect',
				true,
			);

			if (needsHideCursor || needsManualSelection) {
				for (let i = transactions.length - 1; i >= 0; i--) {
					const meta = transactions[i].getMeta(selectionPluginKey);

					if (needsHideCursor && meta?.hideCursor !== undefined) {
						const newHideCursorValue = meta.hideCursor;
						if (cursorHidden !== newHideCursorValue) {
							cursorHidden = newHideCursorValue;
							hideCursorChanged = true;
						}
					}

					if (needsManualSelection && meta?.manualSelection && !manualSelection) {
						manualSelection = meta.manualSelection;
						if (!needsHideCursor) {
							break;
						}
					}
				}
			}

			if (
				!shouldRecalcDecorations({ oldEditorState, newEditorState }) &&
				!manualSelection &&
				!hideCursorChanged
			) {
				return;
			}

			tr.setMeta(selectionPluginKey, {
				type: SelectionActionTypes.SET_DECORATIONS,
				selection: tr.selection,
				decorationSet: getDecorations(tr, manualSelection, cursorHidden),
			});

			return tr;
		},

		filterTransaction(tr, state) {
			// Prevent single click selecting atom nodes on mobile (we want to select with long press gesture instead)
			if (
				options.useLongPressSelection &&
				tr.selectionSet &&
				tr.selection instanceof NodeSelection &&
				!tr.getMeta(selectionPluginKey)
			) {
				return false;
			}

			// Prevent prosemirror's mutation observer overriding a node selection with a text selection
			// for exact same range - this was cause of being unable to change dates in collab:
			// https://product-fabric.atlassian.net/browse/ED-10645
			if (
				state.selection instanceof NodeSelection &&
				tr.selection instanceof TextSelection &&
				state.selection.from === tr.selection.from &&
				state.selection.to === tr.selection.to
			) {
				return false;
			}

			return true;
		},

		props: {
			createSelectionBetween: onCreateSelectionBetween,
			decorations(state) {
				const interactionState = api?.interaction?.sharedState.currentState()?.interactionState;

				// Do not show selection decorations for live pages where the user has not
				// interacted with the page. We do not show cursor until interaction and we do not
				// want to show selections either.
				if (
					(options.__livePage ||
						expValEquals('platform_editor_no_cursor_on_edit_page_init', 'isEnabled', true)) &&
					interactionState === 'hasNotHadInteraction'
				) {
					return DecorationSet.empty;
				}

				return getPluginState(state).decorationSet;
			},

			handleDOMEvents: {
				keydown: createOnKeydown({ __livePage: options.__livePage }),
				// Without this event, it is not possible to click and drag to select the first node in the
				// document if the node is a block with content (e.g. a panel with a paragraph inside).
				mouseout: onMouseOut,
			},
		},
	});
};

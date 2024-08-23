import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import type { EditorCommand } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, TextSelection } from '@atlaskit/editor-prosemirror/state';

import { ACTIONS } from '../pm-plugins/actions';
import { pluginKey } from '../pm-plugins/key';
import type { TypeAheadHandler, TypeAheadInputMethod } from '../types';

type Props = {
	triggerHandler: TypeAheadHandler;
	inputMethod: TypeAheadInputMethod;
	query?: string;
};

export const openTypeAhead = (props: Props) => (tr: Transaction) => {
	const { triggerHandler, inputMethod, query } = props;

	tr.setMeta(pluginKey, {
		action: ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR,
		params: {
			triggerHandler,
			inputMethod,
			query,
		},
	});
};

export const openTypeAheadAtCursor =
	({ triggerHandler, inputMethod, query }: Props): EditorCommand =>
	({ tr }) => {
		openTypeAhead({
			triggerHandler,
			inputMethod,
			query,
		})(tr);

		const { selection } = tr;
		const isInline = selection instanceof NodeSelection && selection.node.type.isInline;

		if (
			!(
				selection instanceof TextSelection ||
				selection instanceof GapCursorSelection ||
				selection instanceof NodeSelection
			)
		) {
			return tr;
		}

		if (selection instanceof GapCursorSelection) {
			// Create space for the typeahead menu in gap cursor
			tr.insertText(' ');
			// delete 1 pos before wherever selection is now - that will delete the empty space
			tr.delete(tr.selection.from - 1, tr.selection.from);
		} else {
			if (selection instanceof NodeSelection) {
				if (isInline) {
					tr.deleteSelection();
					return tr;
				}
				return tr;
			}

			if (!selection.$cursor) {
				tr.deleteSelection();
				return tr;
			}

			// Search & Destroy placeholder
			const cursorPos = selection.$cursor.pos;
			const nodeAtCursor = tr.doc.nodeAt(cursorPos);

			const isPlaceholderAtCursorPosition =
				nodeAtCursor && nodeAtCursor.type.name === 'placeholder';

			if (nodeAtCursor && isPlaceholderAtCursorPosition) {
				tr.delete(cursorPos, cursorPos + nodeAtCursor.nodeSize);
			}

			// ME-2375 remove the superfluous '@' inserted before decoration
			// by composition (https://github.com/ProseMirror/prosemirror/issues/903)
			//
			// Update:
			// Now also handles any use case with superfluous typeahead triggers (ie. '@', ':', '/')
			// being inserted due to composition by checking if we have the trigger
			// directly before the typeahead. This should not happen unless it has
			// been eroneously added because we require whitespace/newline for typeahead.
			if (
				cursorPos >= 2 &&
				!!selection?.$head?.parent?.textContent &&
				selection.$head.parent.textContent.endsWith?.(triggerHandler.trigger)
			) {
				tr.delete(cursorPos - 1, cursorPos);
			}
		}

		return tr;
	};

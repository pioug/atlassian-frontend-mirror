import type { LinkStepMetadata } from '@atlaskit/adf-schema/steps';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { addLinkMetadata } from './addLinkMetadata';

export type CommandDispatch = (tr: Transaction) => void;

export type Command = (
	state: EditorState,
	dispatch?: CommandDispatch,
	view?: EditorView,
) => boolean;

/**
 * Adds metadata to the transaction created from a command
 * The metadata describes the user intent and input method
 * for executing the command
 */
export const commandWithMetadata = (command: Command, metadata: LinkStepMetadata): Command => {
	return (state, dispatch, view) => {
		if (!dispatch) {
			return command(state, dispatch, view);
		}

		return command(
			state,
			(tr: Transaction) => {
				addLinkMetadata(state.selection, tr, metadata);
				dispatch(tr);
			},
			view,
		);
	};
};
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { addLinkMetadata } from './addLinkMetadata';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { getLinkMetadataFromTransaction } from './getLinkMetadataFromTransaction';

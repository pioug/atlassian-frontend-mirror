import type {
  EditorState,
  ReadonlyTransaction,
  Selection,
  Transaction,
} from 'prosemirror-state';
import type { EditorView } from 'prosemirror-view';

import { LinkMetaStep, LinkStepMetadata } from '@atlaskit/adf-schema/steps';

/**
 * Records metadata about the user action and input method relating to a transaction
 * as a custom LinkStepMetadata prosemirror step so that it is preserved in
 * the history for undo/redo
 */
export function addLinkMetadata(
  initialSelection: Selection,
  tr: Transaction,
  metadata: LinkStepMetadata,
) {
  const { storedMarks } = tr;
  const pos = tr.mapping.map(initialSelection.$from.pos);
  tr.step(new LinkMetaStep(pos, metadata));

  // When you add a new step all the storedMarks are removed it
  if (storedMarks) {
    tr.setStoredMarks(storedMarks);
  }

  return tr;
}

export function getLinkMetadataFromTransaction(
  tr: Transaction | ReadonlyTransaction,
) {
  return tr.steps.reduce<LinkStepMetadata>((metadata, step) => {
    if (!(step instanceof LinkMetaStep)) {
      return metadata;
    }

    return {
      ...metadata,
      ...step.getMetadata(),
    };
  }, {});
}

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
export const commandWithMetadata = (
  command: Command,
  metadata: LinkStepMetadata,
): Command => {
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

import { receiveTransaction } from '@atlaskit/prosemirror-collab';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import type {
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
  AllSelection,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type {
  CollabEventInitData,
  CollabEventRemoteData,
  CollabEventConnectionData,
  CollabEventPresenceData,
  CollabTelepointerPayload,
  CollabSendableSelection,
} from '@atlaskit/editor-common/collab';

import type { PrivateCollabEditOptions } from './types';

import { replaceDocument } from './utils';

export const handleInit = (
  initData: CollabEventInitData,
  view: EditorView,
  options?: PrivateCollabEditOptions,
) => {
  const { doc, json, version, reserveCursor } = initData;
  if (doc) {
    const { state } = view;
    const tr = replaceDocument(doc, state, version, options, reserveCursor);
    tr.setMeta('isRemote', true);
    view.dispatch(tr);
  } else if (json) {
    applyRemoteSteps(json, view);
  }
};

export const handleConnection = (
  connectionData: CollabEventConnectionData,
  view: EditorView,
) => {
  const {
    state: { tr },
  } = view;
  view.dispatch(tr.setMeta('sessionId', connectionData));
};

export const handlePresence = (
  presenceData: CollabEventPresenceData,
  view: EditorView,
) => {
  const {
    state: { tr },
  } = view;
  view.dispatch(tr.setMeta('presence', presenceData));
};

export const applyRemoteData = (
  remoteData: CollabEventRemoteData,
  view: EditorView,
  options: PrivateCollabEditOptions,
) => {
  const { json, userIds = [] } = remoteData;
  if (json) {
    applyRemoteSteps(json, view, userIds, options);
  }
};

export const applyRemoteSteps = (
  json: any[],
  view: EditorView,
  userIds?: (number | string)[],
  options?: PrivateCollabEditOptions,
) => {
  if (!json || !json.length) {
    return;
  }

  const {
    state,
    state: { schema },
  } = view;

  const steps = json.map((step) => Step.fromJSON(schema, step));

  let tr: Transaction;

  if (options && options.useNativePlugin && userIds) {
    tr = receiveTransaction(state, steps, userIds);
  } else {
    tr = state.tr;
    steps.forEach((step) => tr.step(step));
  }

  if (tr) {
    tr.setMeta('addToHistory', false);
    tr.setMeta('isRemote', true);

    const { from, to } = state.selection;
    const [firstStep] = json;

    /*
     * Persist marks across transactions. Fixes an issue where
     * marks are lost if remote transactions are dispatched
     * between a user creating the mark and typing.
     */
    if (state.tr.storedMarks) {
      tr.setStoredMarks(state.tr.storedMarks);
    }

    /**
     * If the cursor is a the same position as the first step in
     * the remote data, we need to manually set it back again
     * in order to prevent the cursor from moving.
     */
    if (from === firstStep.from && to === firstStep.to) {
      tr.setSelection(state.selection.map(tr.doc, tr.mapping));
    }

    view.dispatch(tr);
  }
};

export const handleTelePointer = (
  telepointerData: CollabTelepointerPayload,
  view: EditorView,
) => {
  const {
    state: { tr },
  } = view;
  view.dispatch(tr.setMeta('telepointer', telepointerData));
};

function isAllSelection(selection: Selection) {
  return selection instanceof AllSelection;
}

function isNodeSelection(selection: Selection) {
  return selection instanceof NodeSelection;
}

export const getSendableSelection = (
  selection: Selection,
): CollabSendableSelection => {
  /**
   * <kbd>CMD + A</kbd> triggers a AllSelection
   * <kbd>escape</kbd> triggers a NodeSelection
   */
  return {
    type: 'textSelection',
    anchor: selection.anchor,
    head:
      isAllSelection(selection) || isNodeSelection(selection)
        ? selection.head - 1
        : selection.head,
  };
};

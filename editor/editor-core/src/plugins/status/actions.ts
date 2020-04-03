import { Fragment } from 'prosemirror-model';
import {
  EditorState,
  NodeSelection,
  Transaction,
  Selection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { uuid } from '@atlaskit/adf-schema';
import { StatusType } from './types';
import { pluginKey } from './plugin-key';
import {
  withAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../analytics';
import { Command } from '../../types';
import { TOOLBAR_MENU_TYPE } from '../insert-block/ui/ToolbarInsertBlock/types';

export const DEFAULT_STATUS: StatusType = {
  text: '',
  color: 'neutral',
};

export const createStatus = (showStatusPickerAtOffset = -2) => (
  insert: (node: Node | Object | string) => Transaction,
  state: EditorState,
): Transaction => {
  const statusNode = state.schema.nodes.status.createChecked({
    ...DEFAULT_STATUS,
    localId: uuid.generate(),
  });

  const tr = insert(statusNode);
  const showStatusPickerAt = tr.selection.from + showStatusPickerAtOffset;
  return tr
    .setSelection(NodeSelection.create(tr.doc, showStatusPickerAt))
    .setMeta(pluginKey, {
      showStatusPickerAt,
      isNew: true,
    });
};

export const updateStatus = (status?: StatusType): Command => (
  state,
  dispatch,
) => {
  const { schema } = state;

  const selectedStatus = status
    ? Object.assign(status, {
        text: status.text.trim(),
        localId: status.localId || uuid.generate(),
      })
    : status;

  const statusProps = {
    ...DEFAULT_STATUS,
    ...selectedStatus,
  };

  let tr = state.tr;
  const { showStatusPickerAt } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    // Same behaviour as quick insert (used in createStatus)
    const statusNode = schema.nodes.status.createChecked(statusProps);
    const fragment = Fragment.fromArray([statusNode, state.schema.text(' ')]);

    const newShowStatusPickerAt = tr.selection.from;
    tr = tr.replaceWith(newShowStatusPickerAt, newShowStatusPickerAt, fragment);
    tr = tr.setSelection(NodeSelection.create(tr.doc, newShowStatusPickerAt));
    tr = tr
      .setMeta(pluginKey, {
        showStatusPickerAt: newShowStatusPickerAt,
        isNew: true,
      })
      .scrollIntoView();
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  }

  if (state.doc.nodeAt(showStatusPickerAt)) {
    tr = tr.setNodeMarkup(showStatusPickerAt, schema.nodes.status, statusProps);
    tr = tr.setSelection(NodeSelection.create(tr.doc, showStatusPickerAt));
    tr = tr.setMeta(pluginKey, { showStatusPickerAt }).scrollIntoView();

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  }

  return false;
};

export const updateStatusWithAnalytics = (
  inputMethod: TOOLBAR_MENU_TYPE,
  status?: StatusType,
): Command =>
  withAnalytics({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.STATUS,
    attributes: { inputMethod },
    eventType: EVENT_TYPE.TRACK,
  })(updateStatus(status));

export const setStatusPickerAt = (showStatusPickerAt: number | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr.setMeta(pluginKey, {
      showStatusPickerAt,
      isNew: false,
    }),
  );
  return true;
};

export const commitStatusPicker = () => (editorView: EditorView) => {
  const { state, dispatch } = editorView;
  const { showStatusPickerAt } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    return;
  }

  const statusNode = state.tr.doc.nodeAt(showStatusPickerAt);

  if (!statusNode) {
    return;
  }

  let tr = state.tr;
  tr = tr.setMeta(pluginKey, {
    showStatusPickerAt: null,
    isNew: false,
  });

  if (statusNode.attrs.text) {
    // still has content - keep content
    // move selection after status if selection did not change
    if (tr.selection.from === showStatusPickerAt) {
      tr = tr.setSelection(
        Selection.near(state.tr.doc.resolve(showStatusPickerAt + 2)),
      );
    }
  } else {
    // no content - remove node
    tr = tr.delete(showStatusPickerAt, showStatusPickerAt + 1);
  }

  dispatch(tr);
  editorView.focus();
};

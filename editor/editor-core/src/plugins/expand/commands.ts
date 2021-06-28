import { EditorState, TextSelection } from 'prosemirror-state';
import { Node as PMNode, NodeType } from 'prosemirror-model';
import { safeInsert } from 'prosemirror-utils';
import { findTable } from '@atlaskit/editor-tables/utils';

import { Command } from '../../types';
import {
  addAnalytics,
  AnalyticsEventPayload,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  INPUT_METHOD,
  EVENT_TYPE,
  PLATFORMS,
  MODE,
} from '../analytics';
import { GapCursorSelection, Side } from '../selection/gap-cursor-selection';

import { findExpand } from './utils';
import { createCommand } from './pm-plugins/plugin-factory';

export const setExpandRef = (ref?: HTMLDivElement | null): Command =>
  createCommand(
    {
      type: 'SET_EXPAND_REF',
      data: {
        ref,
      },
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const deleteExpandAtPos = (
  expandNodePos: number,
  expandNode: PMNode,
): Command => (state, dispatch) => {
  if (!expandNode || isNaN(expandNodePos)) {
    return false;
  }

  const payload: AnalyticsEventPayload = {
    action: ACTION.DELETED,
    actionSubject:
      expandNode.type === state.schema.nodes.expand
        ? ACTION_SUBJECT.EXPAND
        : ACTION_SUBJECT.NESTED_EXPAND,
    attributes: { inputMethod: INPUT_METHOD.TOOLBAR },
    eventType: EVENT_TYPE.TRACK,
  };

  if (expandNode && dispatch) {
    dispatch(
      addAnalytics(
        state,
        state.tr.delete(expandNodePos, expandNodePos + expandNode.nodeSize),
        payload,
      ),
    );
  }

  return true;
};

export const deleteExpand = (): Command => (state, dispatch) => {
  const expandNode = findExpand(state);
  if (!expandNode) {
    return false;
  }

  return deleteExpandAtPos(expandNode.pos, expandNode.node)(state, dispatch);
};

export const updateExpandTitle = (
  title: string,
  pos: number,
  nodeType: NodeType,
): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (node && node.type === nodeType && dispatch) {
    const { tr } = state;
    tr.setNodeMarkup(
      pos,
      node.type,
      {
        ...node.attrs,
        title,
      },
      node.marks,
    );
    dispatch(tr);
  }
  return true;
};

export const toggleExpandExpanded = (
  pos: number,
  nodeType: NodeType,
): Command => (state, dispatch) => {
  const node = state.doc.nodeAt(pos);
  if (node && node.type === nodeType && dispatch) {
    const { tr } = state;
    const isExpandedNext = !node.attrs.__expanded;
    tr.setNodeMarkup(
      pos,
      node.type,
      {
        ...node.attrs,
        __expanded: isExpandedNext,
      },
      node.marks,
    );

    // If we're going to collapse the expand and our cursor is currently inside
    // Move to a right gap cursor, if the toolbar is interacted (or an API),
    // it will insert below rather than inside (which will be invisible).
    if (isExpandedNext === false && findExpand(state)) {
      tr.setSelection(
        new GapCursorSelection(tr.doc.resolve(pos + node.nodeSize), Side.RIGHT),
      );
    }

    // log when people open/close expands
    // TODO: ED-8523 make platform/mode global attributes?
    const payload: AnalyticsEventPayload = {
      action: ACTION.TOGGLE_EXPAND,
      actionSubject:
        nodeType === state.schema.nodes.expand
          ? ACTION_SUBJECT.EXPAND
          : ACTION_SUBJECT.NESTED_EXPAND,
      attributes: {
        platform: PLATFORMS.WEB,
        mode: MODE.EDITOR,
        expanded: isExpandedNext,
      },
      eventType: EVENT_TYPE.TRACK,
    };

    // `isRemote` meta prevents this step from being
    // sync'd between sessions in collab edit
    dispatch(addAnalytics(state, tr.setMeta('isRemote', true), payload));
  }
  return true;
};

export const createExpandNode = (state: EditorState): PMNode => {
  const { expand, nestedExpand } = state.schema.nodes;
  const expandType = findTable(state.selection) ? nestedExpand : expand;
  return expandType.createAndFill({});
};

export const insertExpand: Command = (state, dispatch) => {
  const expandNode = createExpandNode(state);

  const payload: AnalyticsEventPayload = {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId:
      expandNode.type === state.schema.nodes.expand
        ? ACTION_SUBJECT_ID.EXPAND
        : ACTION_SUBJECT_ID.NESTED_EXPAND,
    attributes: { inputMethod: INPUT_METHOD.INSERT_MENU },
    eventType: EVENT_TYPE.TRACK,
  };

  if (dispatch) {
    dispatch(
      addAnalytics(
        state,
        safeInsert(expandNode)(state.tr).scrollIntoView(),
        payload,
      ),
    );
  }

  return true;
};

export const focusTitle = (pos: number): Command => (
  state,
  dispatch,
  editorView,
) => {
  if (editorView) {
    const dom = editorView.domAtPos(pos);
    const expandWrapper = dom.node.parentElement;
    if (expandWrapper) {
      setSelectionInsideExpand(state, dispatch, editorView);
      const input = expandWrapper.querySelector('input');
      if (input) {
        input.focus();
        return true;
      }
    }
  }
  return false;
};

// Used to clear any node or cell selection when expand title is focused
export const setSelectionInsideExpand: Command = (
  state,
  dispatch,
  editorView,
) => {
  const { tr, doc, selection } = state;

  if (editorView && !editorView.hasFocus()) {
    editorView.focus();
  }
  if (dispatch) {
    dispatch(tr.setSelection(TextSelection.create(doc, selection.from)));
  }
  return true;
};

import {
  findParentNodeOfType,
  findSelectedNodeOfType,
  removeSelectedNode,
  removeParentNodeOfType,
  isNodeSelection,
} from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { Command } from '../../types';
import { pluginKey } from './plugin-key';
import { CodeBlockState } from './pm-plugins/main-state';
import { ACTIONS } from './pm-plugins/actions';
import { copyToClipboard } from '../../utils/clipboard';
import { addAnalytics } from '../analytics/utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics/types';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };
export const removeCodeBlock: Command = (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  if (dispatch) {
    let removeTr = tr;
    if (findSelectedNodeOfType(nodes.codeBlock)(tr.selection)) {
      removeTr = removeSelectedNode(tr);
    } else {
      removeTr = removeParentNodeOfType(nodes.codeBlock)(tr);
    }
    dispatch(removeTr);
  }
  return true;
};

export const changeLanguage = (language: string): Command => (
  state,
  dispatch,
) => {
  const { codeBlock } = state.schema.nodes;
  const pos = pluginKey.getState(state)?.pos;

  if (typeof pos !== 'number') {
    return false;
  }

  const tr = state.tr
    .setNodeMarkup(pos, codeBlock, { language })
    .setMeta('scrollIntoView', false);

  const selection = isNodeSelection(state.selection)
    ? NodeSelection.create(tr.doc, pos)
    : tr.selection;

  const result = tr.setSelection(selection);

  if (dispatch) {
    dispatch(
      addAnalytics(state, result, {
        action: ACTION.LANGUAGE_SELECTED,
        actionSubject: ACTION_SUBJECT.CODE_BLOCK,
        attributes: { language },
        eventType: EVENT_TYPE.TRACK,
      }),
    );
  }

  return true;
};

export const copyContentToClipboard: Command = (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;

  const codeBlock = findParentNodeOfType(nodes.codeBlock)(tr.selection);
  const textContent = codeBlock && codeBlock.node.textContent;

  if (textContent) {
    copyToClipboard(textContent);
    let copyToClipboardTr = tr;

    copyToClipboardTr.setMeta(pluginKey, {
      type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
      data: true,
    });

    if (dispatch) {
      dispatch(copyToClipboardTr);
    }
  }

  return true;
};

export const resetCopiedState: Command = (state, dispatch) => {
  const { tr } = state;
  const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
  let resetCopiedStateTr = tr;

  if (codeBlockState && codeBlockState.contentCopied) {
    resetCopiedStateTr.setMeta(pluginKey, {
      type: ACTIONS.SET_COPIED_TO_CLIPBOARD,
      data: false,
    });
    if (dispatch) {
      dispatch(resetCopiedStateTr);
    }
  }

  return true;
};

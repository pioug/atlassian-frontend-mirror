import { Command } from '../../types';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { pluginKey } from './pm-plugins/plugin-key';
import { NodeType } from 'prosemirror-model';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { DOMSerializer } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { copyHTMLToClipboard } from '../../utils/clipboard';

export const copy = (nodeType: NodeType): Command => (state, dispatch) => {
  const { tr, schema } = state;

  // This command should only be triggered by the Copy button in the floating toolbar
  // which is only visible when selection is inside the target node
  let node = findSelectedNodeOfType(nodeType)(tr.selection);
  if (!node) {
    node = findParentNodeOfType(nodeType)(tr.selection);
  }
  if (!node) {
    return false;
  }

  const domNode = DOMSerializer.fromSchema(schema).serializeNode(node.node);
  const div = document.createElement('div');
  div.appendChild(domNode);

  // The "0 0" refers to the start and end depth of the slice
  // since we're coping the block node only, it will always be 0 0
  // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
  (div.firstChild as HTMLElement).setAttribute('data-pm-slice', '0 0 []');

  copyHTMLToClipboard(div.innerHTML);

  const copyToClipboardTr = tr;
  copyToClipboardTr.setMeta(pluginKey, { copied: true });

  if (dispatch) {
    dispatch(copyToClipboardTr);
  }

  return true;
};

export const resetCopiedState = (
  nodeType: NodeType,
  onMouseLeave?: Command,
): Command => (state, dispatch) => {
  let customTr = state.tr;

  // Avoid multipe dispatch
  // https://product-fabric.atlassian.net/wiki/spaces/E/pages/2241659456/All+about+dispatch+and+why+there+shouldn+t+be+multiple#How-do-I-avoid-them%3F
  const customDispatch = (tr: Transaction) => {
    customTr = tr;
  };

  onMouseLeave
    ? onMouseLeave(state, customDispatch)
    : hoverDecoration(nodeType, false)(state, customDispatch);

  const copyButtonState = pluginKey.getState(state);
  if (copyButtonState?.copied) {
    customTr.setMeta(pluginKey, { copied: false });
  }

  if (dispatch) {
    dispatch(customTr);
  }

  return true;
};

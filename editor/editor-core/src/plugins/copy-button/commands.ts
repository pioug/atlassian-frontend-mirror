import { Command } from '../../types';
import { pluginKey } from './pm-plugins/plugin-key';
import { NodeType } from 'prosemirror-model';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { Transaction } from 'prosemirror-state';
import { copyHTMLToClipboard } from '../../utils/clipboard';
import { getSelectedNodeOrNodeParentByNodeType, toDOM } from './utils';
import { addAnalytics, ACTION, INPUT_METHOD } from '../analytics';
import { getAnalyticsPayload } from '../clipboard/pm-plugins/main';

export const createToolbarCopyCommand = (
  nodeType: NodeType | Array<NodeType>,
): Command => (state, dispatch) => {
  const { tr, schema } = state;

  // This command should only be triggered by the Copy button in the floating toolbar
  // which is only visible when selection is inside the target node
  let node = getSelectedNodeOrNodeParentByNodeType({
    nodeType,
    selection: tr.selection,
  });
  if (!node) {
    return false;
  }

  const domNode = toDOM(node.node, schema);
  if (domNode) {
    const div = document.createElement('div');
    div.appendChild(domNode);

    // if copying inline content
    if (node.node.type.inlineContent) {
      // The "1 1" refers to the start and end depth of the slice
      // since we're copying the text inside a paragraph, it will always be 1 1
      // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
      (div.firstChild as HTMLElement).setAttribute('data-pm-slice', '1 1 []');
    } else {
      // The "0 0" refers to the start and end depth of the slice
      // since we're copying the block node only, it will always be 0 0
      // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
      (div.firstChild as HTMLElement).setAttribute('data-pm-slice', '0 0 []');
    }
    copyHTMLToClipboard(div.innerHTML);
  }

  const copyToClipboardTr = tr;
  copyToClipboardTr.setMeta(pluginKey, { copied: true });

  const analyticsPayload = getAnalyticsPayload(state, ACTION.COPIED);
  if (analyticsPayload) {
    analyticsPayload.attributes.inputMethod = INPUT_METHOD.FLOATING_TB;
    analyticsPayload.attributes.nodeType = node.node.type.name;
    addAnalytics(state, copyToClipboardTr, analyticsPayload);
  }
  if (dispatch) {
    dispatch(copyToClipboardTr);
  }

  return true;
};

export const resetCopiedState = (
  nodeType: NodeType | Array<NodeType>,
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

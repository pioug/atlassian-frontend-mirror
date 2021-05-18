import { browser } from '@atlaskit/editor-common';
import { EditorState, Transaction } from 'prosemirror-state';
import { pluginKey } from './plugin-key';

// Workaround for a firefox issue where dom selection is off sync
// https://product-fabric.atlassian.net/browse/ED-12442
const refreshBrowserSelection = () => {
  const domSelection = window.getSelection();
  if (domSelection) {
    const domRange =
      domSelection &&
      domSelection.rangeCount === 1 &&
      domSelection.getRangeAt(0).cloneRange();
    if (domRange) {
      domSelection.removeAllRanges();
      domSelection.addRange(domRange);
    }
  }
};

const refreshBrowserSelectionOnChange = (
  transaction: Transaction,
  editorState: EditorState,
) => {
  if (
    browser.gecko &&
    transaction.docChanged &&
    // codeblockState.pos should be set if current selection is in a codeblock.
    typeof pluginKey.getState(editorState)?.pos === 'number'
  ) {
    refreshBrowserSelection();
  }
};

export default refreshBrowserSelectionOnChange;

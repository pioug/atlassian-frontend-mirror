import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import type { Command } from '../types';

import { createWrapSelectionTransaction } from './create-wrap-selection-transaction';
/**
 * Function will add wrapping node.
 * 1. If currently selected blocks can be wrapped in the wrapper type it will wrap them.
 * 2. If current block can not be wrapped inside wrapping block it will create a new block below selection,
 *  and set selection on it.
 */
export function wrapSelectionIn(type: NodeType): Command {
  return function (state: EditorState, dispatch) {
    let tr = createWrapSelectionTransaction({ state, type });
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

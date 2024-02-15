import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { FindReplacePluginState } from '../types';

import { createPluginState, getPluginState } from './plugin-factory';
import { findReplacePluginKey } from './plugin-key';

export const initialState: FindReplacePluginState = {
  isActive: false,
  shouldFocus: false,
  findText: '',
  replaceText: '',
  index: 0,
  matches: [],
  decorationSet: DecorationSet.empty,
  shouldMatchCase: false,
};

export const createPlugin = (dispatch: Dispatch) =>
  new SafePlugin({
    key: findReplacePluginKey,
    state: createPluginState(dispatch, () => initialState),
    props: {
      decorations(state: EditorState) {
        const { isActive, findText, decorationSet } = getPluginState(state);
        if (isActive && findText) {
          return decorationSet;
        }
      },
    },
  });

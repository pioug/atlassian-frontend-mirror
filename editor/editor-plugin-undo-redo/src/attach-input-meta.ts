import type { HigherOrderCommand } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { InputSource } from './enums';
import { pluginKey as undoPluginKey } from './pm-plugins/plugin-key';

type AttachInputMeta = (inputSource: InputSource) => HigherOrderCommand;
export const attachInputMeta: AttachInputMeta =
  inputSource => command => (state, dispatch) => {
    let customTr: Transaction = state.tr;
    const fakeDispatch = (tr: Transaction) => {
      customTr = tr;
    };
    command(state, fakeDispatch);

    if (!customTr || !customTr.docChanged) {
      return false;
    }

    customTr.setMeta(undoPluginKey, inputSource);
    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };

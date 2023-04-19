import { FeatureFlags } from '@atlaskit/editor-common/types';
import { Command } from '../../types';
import { INPUT_METHOD } from '../analytics';
import { createHorizontalRule } from './pm-plugins/input-rule';

export const insertHorizontalRule =
  (
    inputMethod:
      | INPUT_METHOD.QUICK_INSERT
      | INPUT_METHOD.TOOLBAR
      | INPUT_METHOD.INSERT_MENU
      | INPUT_METHOD.FORMATTING
      | INPUT_METHOD.SHORTCUT,
    featureFlags: FeatureFlags,
  ): Command =>
  (state, dispatch) => {
    const tr = createHorizontalRule(
      state,
      featureFlags,
      state.selection.from,
      state.selection.to,
      inputMethod,
    );
    if (tr) {
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }

    return false;
  };

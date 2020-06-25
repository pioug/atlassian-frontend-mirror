import { removeParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../types';
import { CodeBlockAttrs } from '@atlaskit/adf-schema';
import { pluginKey } from './plugin-key';
import { CodeBlockState } from './pm-plugins/main';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };
export const removeCodeBlock: Command = (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  if (dispatch) {
    dispatch(removeParentNodeOfType(nodes.codeBlock)(tr));
  }
  return true;
};

export const changeLanguage = (language: string): Command => (
  state,
  dispatch,
) => {
  const {
    schema: {
      nodes: { codeBlock },
    },
    tr,
  } = state;

  const attrs: CodeBlockAttrs = { language };
  const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
  if (codeBlockState === undefined) {
    return false;
  }
  const { pos } = codeBlockState;
  if (pos === null) {
    return false;
  }

  const changeLanguageTr = tr.setNodeMarkup(pos, codeBlock, attrs);
  changeLanguageTr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(changeLanguageTr);
  }
  return true;
};

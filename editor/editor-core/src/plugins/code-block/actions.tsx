import { setParentNodeMarkup, removeParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../types';
import { CodeBlockAttrs } from '@atlaskit/adf-schema';

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
    schema: { nodes },
    tr,
  } = state;

  // setParentNodeMarkup doesn't typecheck the attributes
  const attrs: CodeBlockAttrs = { language };

  const changeLanguageTr = setParentNodeMarkup(
    nodes.codeBlock,
    null,
    attrs,
  )(tr);
  changeLanguageTr.setMeta('scrollIntoView', false);

  if (dispatch) {
    dispatch(changeLanguageTr);
  }
  return true;
};

import { toggleMark } from 'prosemirror-commands';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { Dispatch } from '../../../event-dispatcher';
import * as keymaps from '../../../keymaps';
import { shallowEqual } from '../../../utils';
import { createInlineCodeFromTextInputWithAnalytics } from '../commands/text-formatting';
// eslint-disable-next-line no-duplicate-imports
import * as commands from '../commands/text-formatting';
import { anyMarkActive } from '../utils';
import { TextFormattingState } from '../types';
import { pluginKey } from './plugin-key';

export { pluginKey };
export type { TextFormattingState };

const getTextFormattingState = (
  editorState: EditorState,
): TextFormattingState => {
  const {
    em,
    code,
    strike,
    strong,
    subsup,
    underline,
  } = editorState.schema.marks;
  const state: TextFormattingState = {};

  if (code) {
    state.codeActive = anyMarkActive(editorState, code.create());
    state.codeDisabled = !toggleMark(code)(editorState);
  }
  if (em) {
    state.emActive = anyMarkActive(editorState, em);
    state.emDisabled = state.codeActive ? true : !toggleMark(em)(editorState);
  }
  if (strike) {
    state.strikeActive = anyMarkActive(editorState, strike);
    state.strikeDisabled = state.codeActive
      ? true
      : !toggleMark(strike)(editorState);
  }
  if (strong) {
    state.strongActive = anyMarkActive(editorState, strong);
    state.strongDisabled = state.codeActive
      ? true
      : !toggleMark(strong)(editorState);
  }
  if (subsup) {
    const subMark = subsup.create({ type: 'sub' });
    const supMark = subsup.create({ type: 'sup' });
    state.subscriptActive = anyMarkActive(editorState, subMark);
    state.subscriptDisabled = state.codeActive
      ? true
      : !toggleMark(subsup, { type: 'sub' })(editorState);
    state.superscriptActive = anyMarkActive(editorState, supMark);
    state.superscriptDisabled = state.codeActive
      ? true
      : !toggleMark(subsup, { type: 'sup' })(editorState);
  }
  if (underline) {
    state.underlineActive = anyMarkActive(editorState, underline);
    state.underlineDisabled = state.codeActive
      ? true
      : !toggleMark(underline)(editorState);
  }
  return state;
};

export const plugin = (dispatch: Dispatch) =>
  new Plugin({
    state: {
      init(_config, state: EditorState): TextFormattingState {
        return getTextFormattingState(state);
      },
      apply(
        _tr,
        pluginState: TextFormattingState,
        _oldState,
        newState,
      ): TextFormattingState {
        const state = getTextFormattingState(newState);
        if (!shallowEqual(pluginState, state)) {
          dispatch(pluginKey, state);
          return state;
        }
        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        const { state, dispatch } = view;
        if (event.key === keymaps.moveRight.common) {
          return commands.moveRight()(state, dispatch);
        } else if (event.key === keymaps.moveLeft.common) {
          return commands.moveLeft()(state, dispatch);
        }
        return false;
      },
      handleTextInput(
        view: EditorView,
        from: number,
        to: number,
        text: string,
      ) {
        const { state, dispatch } = view;
        const {
          schema,
          selection: {
            $from: {
              parent: { type: parentNodeType },
            },
          },
        } = state;

        if (parentNodeType.allowsMarkType(schema.marks.code)) {
          return createInlineCodeFromTextInputWithAnalytics(
            from,
            to,
            text,
          )(state, dispatch);
        }

        return false;
      },
    },
  });

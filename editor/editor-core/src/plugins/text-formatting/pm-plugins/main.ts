// TODO: Ideally this should use the custom toggleMark function from @atlaskit/editor-common so we also disable the options when selecting inline nodes but it disables the marks when the selection is empty at this point in time which is undesirable
// import { toggleMark } from '@atlaskit/editor-common/mark';
import { toggleMark } from '@atlaskit/editor-prosemirror/commands';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import * as keymaps from '@atlaskit/editor-common/keymaps';
import { shallowEqual } from '@atlaskit/editor-common/utils';
import { createInlineCodeFromTextInputWithAnalytics } from '../commands/text-formatting';
import * as commands from '../commands/text-formatting';
import { anyMarkActive } from '../utils';
import type { TextFormattingState } from '../types';
import { pluginKey } from './plugin-key';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export { pluginKey };
export type { TextFormattingState };

const getTextFormattingState = (
  editorState: EditorState,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): TextFormattingState => {
  const { em, code, strike, strong, subsup, underline } =
    editorState.schema.marks;
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

export const plugin = (
  dispatch: Dispatch,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) =>
  new SafePlugin({
    state: {
      init(_config, state: EditorState): TextFormattingState {
        return getTextFormattingState(state, editorAnalyticsAPI);
      },
      apply(
        _tr,
        pluginState: TextFormattingState,
        _oldState,
        newState,
      ): TextFormattingState {
        const state = getTextFormattingState(newState, editorAnalyticsAPI);
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
        if (event.key === keymaps.moveRight.common && !event.metaKey) {
          return commands.moveRight()(state, dispatch);
        } else if (event.key === keymaps.moveLeft.common && !event.metaKey) {
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
          return createInlineCodeFromTextInputWithAnalytics(editorAnalyticsAPI)(
            from,
            to,
            text,
          )(state, dispatch);
        }

        return false;
      },
    },
  });

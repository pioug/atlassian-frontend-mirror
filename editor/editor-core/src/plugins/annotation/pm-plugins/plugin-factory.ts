import { pluginFactory } from '../../../utils/plugin-state-factory';
import { InlineCommentAction, InlineCommentPluginState } from '../types';
import { PluginKey } from 'prosemirror-state';

function reducer(
  pluginState: InlineCommentPluginState,
  action: InlineCommentAction,
): InlineCommentPluginState {
  switch (action.type) {
    case 'INLINE_COMMENT_RESOLVE':
      return {
        ...pluginState,
        [action.data.id]: true,
      };
    case 'SET_INLINE_COMMENT_STATE':
      return action.data;
    default:
      return pluginState;
  }
}

export const pluginKey = new PluginKey('inlineCommentPlugin');
export const { createPluginState, createCommand } = pluginFactory(
  pluginKey,
  reducer,
);

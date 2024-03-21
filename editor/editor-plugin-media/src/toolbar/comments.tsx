import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { commentMessages as messages } from '@atlaskit/editor-common/media';
import type {
  Command,
  CommandDispatch,
  ExtractInjectionAPI,
  FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import type { MediaNextEditorPluginType } from '../next-plugin-type';

export const commentButton = (
  intl: IntlShape,
  _state: EditorState,
  api: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
): FloatingToolbarButton<Command> => {
  const title = intl.formatMessage(messages.addCommentOnMedia);

  const onClickHandler = (state: EditorState, dispatch?: CommandDispatch) => {
    if (api?.annotation && state.selection instanceof NodeSelection) {
      const mediaNode = state.selection.node.firstChild;

      const command =
        api.annotation.actions.showCommentForBlockNode(mediaNode) ||
        api.annotation.actions.setInlineCommentDraftState(
          true,
          // TODO: might need to update to reflect it's from media floating toolbar
          INPUT_METHOD.FLOATING_TB,
          'block',
          true,
        );

      command(state, dispatch);
    }
    return true;
  };

  return {
    type: 'button',
    testId: 'add-comment-media-button',
    icon: CommentIcon,
    title,
    onClick: onClickHandler,
    tooltipContent: <ToolTipContent description={title} />,
  };
};

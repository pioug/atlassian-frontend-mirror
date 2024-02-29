import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { commentMessages as messages } from '@atlaskit/editor-common/media';
import type {
  Command,
  FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import CommentIcon from '@atlaskit/icon/glyph/comment';

export const commentButton = (
  intl: IntlShape,
  state: EditorState,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): FloatingToolbarButton<Command> => {
  const title = intl.formatMessage(messages.addCommentOnMedia);

  const onClickHandler = () => {
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

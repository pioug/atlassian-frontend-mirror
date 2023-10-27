import React from 'react';
import type { IntlShape } from 'react-intl-next';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import CommentIcon from '@atlaskit/icon/glyph/comment';
import type { Command } from '../../types';
import { addInlineComment, ToolTipContent } from '../../keymaps';
import type {
  FloatingToolbarConfig,
  FloatingToolbarButton,
} from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { setInlineCommentDraftState } from './commands';
import { AnnotationTestIds, AnnotationSelectionType } from './types';
import { isSelectionValid } from './utils';
import { annotationMessages } from '@atlaskit/editor-common/messages';
import {
  calculateToolbarPositionAboveSelection,
  calculateToolbarPositionTrackHead,
} from '@atlaskit/editor-common/utils';

export const buildToolbar =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
  (
    state: EditorState,
    intl: IntlShape,
    isToolbarAbove: boolean = false,
  ): FloatingToolbarConfig | undefined => {
    const { schema } = state;
    const selectionValid = isSelectionValid(state);
    if (selectionValid === AnnotationSelectionType.INVALID) {
      return undefined;
    }

    const createCommentMessage = intl.formatMessage(
      annotationMessages.createComment,
    );
    const commentDisabledMessage = intl.formatMessage(
      annotationMessages.createCommentInvalid,
    );

    const createComment: FloatingToolbarButton<Command> = {
      type: 'button',
      showTitle: true,
      disabled: selectionValid === AnnotationSelectionType.DISABLED,
      testId: AnnotationTestIds.floatingToolbarCreateButton,
      icon: CommentIcon,
      tooltipContent:
        selectionValid === AnnotationSelectionType.DISABLED ? (
          commentDisabledMessage
        ) : (
          <ToolTipContent
            description={createCommentMessage}
            keymap={addInlineComment}
          />
        ),
      title: createCommentMessage,
      onClick: (state, dispatch) => {
        return setInlineCommentDraftState(editorAnalyticsAPI)(true)(
          state,
          dispatch,
        );
      },
    };

    const { annotation } = schema.marks;
    const validNodes = Object.keys(schema.nodes).reduce<NodeType[]>(
      (acc, current) => {
        const type = schema.nodes[current];
        if (type.allowsMarkType(annotation)) {
          acc.push(type);
        }
        return acc;
      },
      [],
    );

    const toolbarTitle = intl.formatMessage(annotationMessages.toolbar);
    const calcToolbarPosition = isToolbarAbove
      ? calculateToolbarPositionAboveSelection
      : calculateToolbarPositionTrackHead;
    const onPositionCalculated = calcToolbarPosition(toolbarTitle);

    return {
      title: toolbarTitle,
      nodeType: validNodes,
      items: [createComment],
      onPositionCalculated,
    };
  };

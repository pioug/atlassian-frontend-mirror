import React from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
  addInlineComment,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import { annotationMessages } from '@atlaskit/editor-common/messages';
import type {
  Command,
  FloatingToolbarButton,
  FloatingToolbarConfig,
} from '@atlaskit/editor-common/types';
import {
  calculateToolbarPositionAboveSelection,
  calculateToolbarPositionTrackHead,
} from '@atlaskit/editor-common/utils';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import { setInlineCommentDraftState } from './commands';
import { AnnotationSelectionType, AnnotationTestIds } from './types';
import { isSelectionValid } from './utils';

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
        if (editorAnalyticsAPI) {
          editorAnalyticsAPI.fireAnalyticsEvent({
            action: ACTION.CLICKED,
            actionSubject: ACTION_SUBJECT.BUTTON,
            actionSubjectId:
              ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
            eventType: EVENT_TYPE.UI,
            attributes: {
              source: 'highlightActionsMenu',
              pageMode: 'edit',
            },
          });
        }
        return setInlineCommentDraftState(editorAnalyticsAPI)(true)(
          state,
          dispatch,
        );
      },
      supportsViewMode: true, // TODO: MODES-3950 Clean up this floating toolbar view mode logic
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
